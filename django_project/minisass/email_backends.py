"""
A Django email backend that delivers through the Amazon SES API.

miniSASS runs in af-south-1, and SES does not publish an SMTP endpoint in that
region: email-smtp.af-south-1.amazonaws.com resolves to no address at all, which
is why every send failed with "No address associated with hostname". The SES API
*is* available in af-south-1, so mail goes over HTTPS to the API instead of over
SMTP.

Using the API rather than SMTP has two further advantages here:

  * Authentication comes from the ECS task role through the normal boto3
    credential chain, so there is no long-lived SMTP password to store, rotate
    or leak. Explicit keys are still supported for environments that need them.
  * It needs only outbound HTTPS, which the task already has for S3 and ECR,
    rather than outbound port 587.

Messages are handed to SES as raw MIME produced by Django itself, so
attachments, alternative parts, custom headers and Reply-To all behave exactly
as they do with the SMTP backend.

The backend also supports a fallback sender. An SES domain has to verify before
it can send and that is asynchronous, so a newly added domain leaves a window in
which no mail goes out at all. Setting AWS_SES_FALLBACK_FROM_EMAIL to an
already-verified identity closes that window: the primary address is tried
first, and only a refusal to send *as that identity* causes a retry from the
fallback. Nothing needs changing when the primary finally verifies - the first
attempt simply starts succeeding.
"""

import logging

from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend

logger = logging.getLogger(__name__)


class SESEmailBackend(BaseEmailBackend):
    """Send email via the SES v2 API instead of SMTP."""

    # SES error codes meaning "you may not send as this identity", as opposed to
    # a transient fault or a problem with the message itself. Only these are
    # worth retrying from a different address; retrying a throttling error or a
    # malformed message from the fallback would just fail twice.
    IDENTITY_ERROR_CODES = frozenset({
        'MessageRejected',
        'MailFromDomainNotVerified',
        'MailFromDomainNotVerifiedException',
        'NotFound',
        'NotFoundException',
    })

    def __init__(self, fail_silently=False, **kwargs):
        super().__init__(fail_silently=fail_silently, **kwargs)
        self._client = None
        self.region_name = getattr(settings, 'AWS_SES_REGION_NAME', None) or 'af-south-1'
        # Optional. A configuration set is what enables SES event publishing
        # (bounces, complaints, deliveries) to CloudWatch or SNS. Left unset the
        # mail still sends; it is simply not tracked.
        self.configuration_set = getattr(settings, 'AWS_SES_CONFIGURATION_SET', None)
        # A second sending identity to use when SES refuses the first.
        #
        # An SES domain identity has to verify before it can send, and that is
        # asynchronous: minisass.org sat at DkimStatus PENDING for over a day
        # with correct DNS. Without a fallback, every password reset and
        # activation email in that window is simply lost.
        #
        # This is deliberately reactive rather than a configuration switch. The
        # primary address is always tried first, so the moment the domain
        # verifies the fallback stops being used - with no redeploy, no secret
        # change, and nobody having to notice.
        self.fallback_from_email = getattr(
            settings, 'AWS_SES_FALLBACK_FROM_EMAIL', None
        ) or None

    def open(self):
        """Create the SES client, returning True if this call created it."""
        if self._client is not None:
            return False

        # Imported lazily so that merely importing this module - which Django
        # does whenever EMAIL_BACKEND is resolved - does not require boto3 or
        # touch the credential chain.
        import boto3

        # Explicit credentials are optional. When they are absent boto3 falls
        # back to its normal chain, which on ECS means the task role. That is
        # the preferred configuration: no static secret to manage.
        access_key = getattr(settings, 'AWS_SES_ACCESS_KEY_ID', None)
        secret_key = getattr(settings, 'AWS_SES_SECRET_ACCESS_KEY', None)

        client_kwargs = {'region_name': self.region_name}
        if access_key and secret_key:
            client_kwargs['aws_access_key_id'] = access_key
            client_kwargs['aws_secret_access_key'] = secret_key

        self._client = boto3.client('sesv2', **client_kwargs)
        return True

    def close(self):
        self._client = None

    def send_messages(self, email_messages):
        """Send messages, returning how many SES accepted."""
        if not email_messages:
            return 0

        created = self.open()
        if self._client is None:
            return 0

        sent = 0
        try:
            for message in email_messages:
                if self._send(message):
                    sent += 1
        finally:
            if created:
                self.close()

        return sent

    def _send(self, message):
        recipients = message.recipients()
        if not recipients:
            return False

        for sender, is_last in self._senders_to_try(message.from_email):
            try:
                return self._attempt(message, sender, recipients)
            except Exception as error:
                if is_last or not self._is_identity_error(error):
                    # SES rejects for reasons an operator needs to see verbatim:
                    # an unverified sending identity, an unverified recipient, a
                    # send-rate limit. The detail is in the exception, so it is
                    # logged rather than swallowed.
                    logger.error(
                        'SES rejected message: subject=%r from=%r to=%r region=%s',
                        message.subject, sender, ', '.join(recipients),
                        self.region_name, exc_info=error,
                    )
                    if not self.fail_silently:
                        raise
                    return False

                logger.warning(
                    'SES will not send as %r (%s); falling back to %r. The '
                    'primary sending domain is most likely still unverified.',
                    sender, self._error_code(error), self.fallback_from_email,
                )

        return False

    def _senders_to_try(self, primary):
        """Yield (address, is_last) for each sending identity worth attempting."""
        fallback = self.fallback_from_email
        if fallback and fallback != primary:
            yield primary, False
            yield fallback, True
        else:
            yield primary, True

    def _attempt(self, message, sender, recipients):
        request = {
            'FromEmailAddress': sender,
            # Envelope recipients. Bcc belongs here and deliberately not in the
            # MIME headers, which is exactly how Django builds the message.
            'Destination': {'ToAddresses': recipients},
            'Content': {'Raw': {'Data': self._raw_mime(message, sender)}},
        }
        if self.configuration_set:
            request['ConfigurationSetName'] = self.configuration_set

        response = self._client.send_email(**request)

        logger.info(
            'SES accepted message: id=%s subject=%r from=%r to=%r',
            response.get('MessageId'), message.subject, sender, ', '.join(recipients),
        )
        return True

    @staticmethod
    def _raw_mime(message, sender):
        """
        Serialise the message with `sender` in the From header.

        The From header lives inside the MIME body, so setting only the
        FromEmailAddress API field would leave the raw message still claiming to
        come from the rejected address - and SES checks that header too, so the
        retry would fail for exactly the same reason. The caller's message is
        restored afterwards, because it belongs to them and may be reused.
        """
        original = message.from_email
        try:
            message.from_email = sender
            return message.message().as_bytes(linesep='\r\n')
        finally:
            message.from_email = original

    @staticmethod
    def _error_code(error):
        """Pull the SES error code out of a botocore ClientError, if present."""
        response = getattr(error, 'response', None)
        if isinstance(response, dict):
            return response.get('Error', {}).get('Code')
        return None

    @classmethod
    def _is_identity_error(cls, error):
        return cls._error_code(error) in cls.IDENTITY_ERROR_CODES

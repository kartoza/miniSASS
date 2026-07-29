"""
Tests for email delivery.

Two things are covered here, and they failed together in production:

  * The SES API backend, which exists because SES publishes no SMTP endpoint in
    af-south-1 and the SMTP backend therefore could never connect.
  * The guarantee that a delivery failure never becomes a 500. Every send site
    used to let the exception escape, so an unreachable mail service took down
    registration, password reset, the contact form and expert approval.
"""

from email import message_from_bytes
from unittest.mock import MagicMock, patch

from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.core.mail.backends.base import BaseEmailBackend
from django.test import TestCase, override_settings

from minisass.email_backends import SESEmailBackend
from minisass.mail import deliver, send_html_email


class UnreachableHostBackend(BaseEmailBackend):
    """
    Reproduces the production fault: a mail host that does not resolve.

    fail_silently is honoured because the real SMTP and SES backends honour it,
    and Django's AdminEmailHandler relies on that when reporting a 5xx.
    """

    def send_messages(self, email_messages):
        if self.fail_silently:
            return 0
        raise OSError('No address associated with hostname')


class SESEmailBackendTests(TestCase):
    """The SES backend must hand SES a well-formed message."""

    def _send(self, message, **settings_overrides):
        """Send through the backend with boto3 replaced, returning the SES call."""
        client = MagicMock()
        client.send_email.return_value = {'MessageId': 'test-message-id'}

        boto3 = MagicMock()
        boto3.client.return_value = client

        with patch.dict('sys.modules', {'boto3': boto3}):
            with override_settings(**settings_overrides):
                backend = SESEmailBackend()
                accepted = backend.send_messages([message])

        return accepted, client, boto3

    def _message(self):
        message = EmailMultiAlternatives(
            subject='Password Reset Request',
            body='Follow the link to reset your password.',
            from_email='no-reply@minisass.org',
            to=['citizen@example.org'],
            reply_to=['support@minisass.org'],
        )
        message.attach_alternative('<p>Follow the link.</p>', 'text/html')
        return message

    def test_message_is_sent_and_counted(self):
        accepted, client, _ = self._send(self._message())

        self.assertEqual(accepted, 1)
        client.send_email.assert_called_once()

    def test_sender_and_envelope_recipients_are_set(self):
        _, client, _ = self._send(self._message())
        request = client.send_email.call_args.kwargs

        self.assertEqual(request['FromEmailAddress'], 'no-reply@minisass.org')
        self.assertEqual(
            request['Destination']['ToAddresses'], ['citizen@example.org']
        )

    def test_raw_mime_keeps_subject_headers_and_both_parts(self):
        """
        The whole point of sending raw MIME is that Django builds the message.
        If SES were handed subject and body as separate API fields instead, the
        HTML alternative and Reply-To would silently disappear.
        """
        _, client, _ = self._send(self._message())
        raw = client.send_email.call_args.kwargs['Content']['Raw']['Data']
        parsed = message_from_bytes(raw)

        self.assertEqual(parsed['Subject'], 'Password Reset Request')
        self.assertEqual(parsed['Reply-To'], 'support@minisass.org')

        payloads = [
            part.get_payload(decode=True).decode()
            for part in parsed.walk()
            if not part.is_multipart()
        ]
        self.assertTrue(any('reset your password' in p for p in payloads))
        self.assertTrue(any('<p>Follow the link.</p>' in p for p in payloads))

    def test_region_defaults_to_af_south_1(self):
        _, _, boto3 = self._send(self._message())

        self.assertEqual(boto3.client.call_args.args[0], 'sesv2')
        self.assertEqual(
            boto3.client.call_args.kwargs['region_name'], 'af-south-1'
        )

    def test_task_role_is_used_when_no_keys_are_configured(self):
        """
        No explicit credentials must be passed to boto3, so it falls back to the
        ECS task role. Passing empty strings would break that fallback.
        """
        _, _, boto3 = self._send(
            self._message(),
            AWS_SES_ACCESS_KEY_ID=None,
            AWS_SES_SECRET_ACCESS_KEY=None,
        )
        kwargs = boto3.client.call_args.kwargs

        self.assertNotIn('aws_access_key_id', kwargs)
        self.assertNotIn('aws_secret_access_key', kwargs)

    def test_explicit_credentials_are_honoured(self):
        _, _, boto3 = self._send(
            self._message(),
            AWS_SES_ACCESS_KEY_ID='AKIAEXAMPLE',
            AWS_SES_SECRET_ACCESS_KEY='secret',
        )
        kwargs = boto3.client.call_args.kwargs

        self.assertEqual(kwargs['aws_access_key_id'], 'AKIAEXAMPLE')
        self.assertEqual(kwargs['aws_secret_access_key'], 'secret')

    def test_configuration_set_is_omitted_unless_configured(self):
        _, client, _ = self._send(self._message(), AWS_SES_CONFIGURATION_SET=None)
        self.assertNotIn('ConfigurationSetName', client.send_email.call_args.kwargs)

        _, client, _ = self._send(self._message(), AWS_SES_CONFIGURATION_SET='minisass')
        self.assertEqual(
            client.send_email.call_args.kwargs['ConfigurationSetName'], 'minisass'
        )

    def test_message_with_no_recipients_is_not_sent(self):
        message = EmailMultiAlternatives(
            subject='Nobody', body='x', from_email='no-reply@minisass.org', to=[]
        )
        accepted, client, _ = self._send(message)

        self.assertEqual(accepted, 0)
        client.send_email.assert_not_called()

    def test_ses_rejection_propagates_unless_fail_silently(self):
        """
        The backend itself must raise, because that is the documented Django
        contract. minisass.mail is the layer that decides to swallow it.
        """
        client = MagicMock()
        client.send_email.side_effect = RuntimeError('Email address is not verified')
        boto3 = MagicMock()
        boto3.client.return_value = client

        with patch.dict('sys.modules', {'boto3': boto3}):
            with self.assertRaises(RuntimeError):
                SESEmailBackend().send_messages([self._message()])

            self.assertEqual(
                SESEmailBackend(fail_silently=True).send_messages([self._message()]), 0
            )


class SESFallbackSenderTests(TestCase):
    """
    When SES refuses the primary sending identity, mail must still go out.

    An SES domain has to verify before it can send and verification is
    asynchronous - minisass.org sat at PENDING for over a day with correct DNS
    published. Without a fallback every password reset in that window is lost.
    """

    PRIMARY = 'no-reply@minisass.org'
    FALLBACK = 'miniSASS <no-reply@digitaltwins.iwmi.org>'

    def _rejection(self, code='MessageRejected'):
        """A botocore-shaped error, which is what the backend inspects."""
        error = Exception(
            'Email address is not verified. The following identities failed the '
            'check in region AF-SOUTH-1: no-reply@minisass.org'
        )
        error.response = {'Error': {'Code': code, 'Message': 'not verified'}}
        return error

    def _message(self):
        message = EmailMultiAlternatives(
            subject='Password Reset Request',
            body='Follow the link to reset your password.',
            from_email=self.PRIMARY,
            to=['citizen@example.org'],
            reply_to=['support@minisass.org'],
        )
        message.attach_alternative('<p>Follow the link.</p>', 'text/html')
        return message

    def _run(self, message, side_effect, fallback=None, fail_silently=False):
        client = MagicMock()
        client.send_email.side_effect = side_effect
        boto3 = MagicMock()
        boto3.client.return_value = client

        with patch.dict('sys.modules', {'boto3': boto3}):
            with override_settings(
                AWS_SES_FALLBACK_FROM_EMAIL=self.FALLBACK if fallback is None else fallback
            ):
                backend = SESEmailBackend(fail_silently=fail_silently)
                accepted = backend.send_messages([message])

        return accepted, client

    def test_unverified_primary_falls_back_and_mail_is_sent(self):
        accepted, client = self._run(
            self._message(),
            side_effect=[self._rejection(), {'MessageId': 'sent-via-fallback'}],
        )

        self.assertEqual(accepted, 1)
        self.assertEqual(client.send_email.call_count, 2)
        self.assertEqual(
            client.send_email.call_args_list[0].kwargs['FromEmailAddress'], self.PRIMARY
        )
        self.assertEqual(
            client.send_email.call_args_list[1].kwargs['FromEmailAddress'], self.FALLBACK
        )

    def test_fallback_rewrites_the_from_header_inside_the_mime(self):
        """
        Overriding only FromEmailAddress would leave the raw message still
        claiming to come from the rejected address, and SES checks that header
        too - so the retry would fail for exactly the same reason.
        """
        _, client = self._run(
            self._message(),
            side_effect=[self._rejection(), {'MessageId': 'sent-via-fallback'}],
        )

        retry_raw = client.send_email.call_args_list[1].kwargs['Content']['Raw']['Data']
        parsed = message_from_bytes(retry_raw)

        self.assertIn('digitaltwins.iwmi.org', parsed['From'])
        self.assertNotIn('minisass.org', parsed['From'])
        # Everything else about the message must survive the retry.
        self.assertEqual(parsed['Subject'], 'Password Reset Request')
        self.assertEqual(parsed['Reply-To'], 'support@minisass.org')

    def test_callers_message_is_left_unmodified(self):
        message = self._message()
        self._run(
            message, side_effect=[self._rejection(), {'MessageId': 'sent-via-fallback'}]
        )

        self.assertEqual(message.from_email, self.PRIMARY)

    def test_verified_primary_never_touches_the_fallback(self):
        """Once the domain verifies, the fallback must cost nothing."""
        accepted, client = self._run(
            self._message(), side_effect=[{'MessageId': 'sent-normally'}]
        )

        self.assertEqual(accepted, 1)
        self.assertEqual(client.send_email.call_count, 1)
        self.assertEqual(
            client.send_email.call_args.kwargs['FromEmailAddress'], self.PRIMARY
        )

    def test_non_identity_errors_do_not_trigger_a_retry(self):
        """
        Throttling and malformed-message errors would fail identically from the
        fallback, so retrying only doubles the load and hides the real cause.
        """
        with self.assertRaises(Exception):
            self._run(
                self._message(),
                side_effect=[self._rejection(code='TooManyRequestsException')],
            )

    def test_no_fallback_configured_propagates_the_original_error(self):
        with self.assertRaises(Exception):
            self._run(self._message(), side_effect=[self._rejection()], fallback=None)

    def test_fallback_identical_to_primary_is_not_retried(self):
        """Guards against configuring the fallback to the address that just failed."""
        with self.assertRaises(Exception):
            self._run(
                self._message(),
                side_effect=[self._rejection()],
                fallback=self.PRIMARY,
            )

    def test_failure_of_both_senders_is_reported_not_looped(self):
        """Two attempts, then stop. No third try, no loop."""
        accepted, client = self._run(
            self._message(),
            side_effect=[self._rejection(), self._rejection()],
            fail_silently=True,
        )

        self.assertEqual(accepted, 0)
        self.assertEqual(client.send_email.call_count, 2)

    def test_fallback_failure_is_surfaced_to_minisass_mail_as_False(self):
        """
        End to end through the helper the views actually call: both identities
        refused means deliver() reports failure rather than raising, so the
        endpoint returns 503 instead of 500.
        """
        client = MagicMock()
        client.send_email.side_effect = [self._rejection(), self._rejection()]
        boto3 = MagicMock()
        boto3.client.return_value = client

        with patch.dict('sys.modules', {'boto3': boto3}):
            with override_settings(
                EMAIL_BACKEND='minisass.email_backends.SESEmailBackend',
                AWS_SES_FALLBACK_FROM_EMAIL=self.FALLBACK,
            ):
                self.assertFalse(
                    send_html_email('Subject', '<p>Body</p>', ['citizen@example.org'])
                )


class MailHelperTests(TestCase):
    """minisass.mail must report failure rather than raise it."""

    def test_deliver_returns_false_instead_of_raising(self):
        message = EmailMultiAlternatives(
            subject='x', body='y', from_email='no-reply@minisass.org',
            to=['someone@example.org'],
        )
        with patch.object(
            type(message), 'send', side_effect=OSError('No address associated with hostname')
        ):
            self.assertFalse(deliver(message))

    def test_send_html_email_derives_a_plain_text_part(self):
        """
        Callers used to pass None as the body with html_message set, producing a
        message whose text/plain part was empty. That hurts spam scoring and
        shows nothing in text-only clients.
        """
        with override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend'):
            from django.core import mail as django_mail
            django_mail.outbox = []

            sent = send_html_email(
                'Activate account on miniSASS',
                '<html><body><p>Welcome to miniSASS.</p></body></html>',
                ['citizen@example.org'],
            )

            self.assertTrue(sent)
            self.assertEqual(len(django_mail.outbox), 1)
            message = django_mail.outbox[0]
            self.assertIn('Welcome to miniSASS.', message.body)
            self.assertEqual(len(message.alternatives), 1)

    def test_send_html_email_refuses_to_send_with_no_recipients(self):
        self.assertFalse(send_html_email('Subject', '<p>Body</p>', []))


@override_settings(EMAIL_BACKEND='minisass.tests.test_email.UnreachableHostBackend')
class EmailFailureDoesNotBreakRequestsTests(TestCase):
    """
    Regression tests for the outage this work addresses.

    With mail unavailable these endpoints returned 500. Registration was the
    damaging case: the account was created and then the response was discarded,
    leaving accounts that existed but could never be activated.

    The failure is injected as a backend rather than by patching
    EmailMessage.send, because Django's own AdminEmailHandler sends mail when it
    logs a 5xx. Patching the send method broke that handler too and produced an
    error that had nothing to do with the code under test.
    """

    def test_password_reset_returns_503_not_500(self):
        User.objects.create_user(
            username='citizen', email='citizen@example.org', password='pw'
        )
        response = self.client.post(
            '/authentication/api/request-reset/',
            {'email': 'citizen@example.org'},
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 503)
        self.assertIn('error', response.json())

    def test_contact_form_returns_503_not_500(self):
        response = self.client.post(
            '/authentication/api/contact-us',
            {'email': 'visitor@example.org', 'name': 'V', 'message': 'Hello'},
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 503)

    def test_registration_still_creates_a_usable_account(self):
        response = self.client.post(
            '/authentication/api/register/',
            {
                'email': 'newcomer@example.org', 'password': 'Str0ng!Passw0rd1',
                'name': 'New', 'surname': 'Comer', 'username': 'newcomer',
                'country': 'South Africa', 'organizationName': 'Test Org',
                'organizationType': 'NGO',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()['activation_email_sent'])
        self.assertIn('warning', response.json())
        self.assertTrue(User.objects.filter(email='newcomer@example.org').exists())

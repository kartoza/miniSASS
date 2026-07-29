"""
Email delivery that cannot take a request down with it.

Mail leaves this application through an external service, so it fails for
reasons that have nothing to do with the request being served: an unreachable
SMTP host, a rejected credential, a sender that has not been verified yet. Every
send site in the project used to let those exceptions escape the view, which
turned a delivery problem into a 500 for the user.

Registration showed why that matters. The account was created, the activation
email then failed, and the exception discarded the response - leaving an account
that existed, could not be activated, and gave its owner no way forward. The
same fault made the password reset form, the contact form and the expert
approval signal fail in ways that looked like the site was broken.

The helpers here keep a delivery failure where it belongs. The caller is told
whether the message went out and decides what the user should see, and the
traceback goes to the log for whoever has to repair the transport.

None of this hides a misconfiguration: a failed send is always logged at
exception level with the recipient and subject, so it is visible in CloudWatch
even though the request itself succeeded.
"""

import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def deliver(message):
    """
    Send a prepared EmailMessage, reporting failure instead of raising.

    Returns True when the transport accepted the message. A True result is not a
    guarantee of delivery - it means the message was handed over successfully.
    """
    if not message.to:
        # Not an error to report to the user as success. An unconfigured
        # recipient list used to mean the transport accepted a message with
        # nowhere to go, so the contact form said "sent" and nothing arrived.
        logger.warning(
            'Refusing to send %r: no recipients configured', message.subject
        )
        return False

    recipients = ', '.join(message.to)
    try:
        message.send()
    except Exception:
        # Deliberately broad. The transport can raise socket errors, SMTP
        # errors, SSL errors or botocore errors depending on the backend, and
        # the caller's correct response is the same for all of them: keep the
        # work that has already been done and report that mail is unavailable.
        logger.exception(
            'Email delivery failed: subject=%r to=%r', message.subject, recipients
        )
        return False

    logger.info('Email delivered: subject=%r to=%r', message.subject, recipients)
    return True


def send_html_email(subject, html_body, recipients, text_body=None,
                    from_email=None, reply_to=None):
    """
    Send an HTML email with a genuine plain-text alternative.

    Callers used to reach send_mail(subject, None, ...) with html_message set,
    which produced a multipart message whose text/plain part was empty. Spam
    filters score that badly and text-only clients showed nothing at all, so the
    text part is derived from the HTML when one is not supplied.

    Returns True when the transport accepted the message.
    """
    if not recipients:
        logger.warning('Refusing to send %r: no recipients configured', subject)
        return False

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body if text_body is not None else strip_tags(html_body).strip(),
        from_email=from_email or settings.DEFAULT_FROM_EMAIL,
        to=recipients,
        reply_to=reply_to,
    )
    message.attach_alternative(html_body, 'text/html')
    return deliver(message)


# Shown to a user whose request succeeded but whose email could not be sent. It
# avoids blaming the user for a server-side fault and points them at the support
# address, which is monitored even when automated mail is not working.
MAIL_UNAVAILABLE_MESSAGE = (
    'We could not send that email right now. This is a problem on our side, not '
    'with your account. Please try again shortly, or contact support@minisass.org '
    'if it keeps happening.'
)

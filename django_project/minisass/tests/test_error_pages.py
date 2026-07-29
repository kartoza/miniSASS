"""
Tests for the error pages.

An error page is the one template that has to work when nothing else does, so
these tests check the property that actually broke in production rather than the
wording. 404.html used to do {% extends "base.html" %}, which resolved to a
third-party template needing a tag this project never loads. Rendering raised
TemplateSyntaxError, so Django returned 500 for every missing URL on the site,
including /favicon.ico.

The structural tests below exist to stop that returning. They assert the rule
rather than the symptom: an error template may not inherit, include, load tags,
or reach for anything over the network.
"""

import re

from django.template import Context, Template
from django.template.loader import get_template
from django.test import RequestFactory, TestCase
from django.urls import Resolver404, resolve
from django.views.defaults import bad_request, permission_denied, page_not_found
from django.views.csrf import csrf_failure


ERROR_TEMPLATES = ['400.html', '403.html', '403_csrf.html', '404.html', '500.html']


class ErrorTemplatesRenderStandaloneTest(TestCase):
    """
    Every error template must render with nothing supplied to it.

    Django renders 500.html with a genuinely empty context - no request, no
    settings, no context processors - so anything depending on a variable would
    raise at exactly the worst moment.
    """

    def test_each_template_renders_with_an_empty_context(self):
        for name in ERROR_TEMPLATES:
            with self.subTest(template=name):
                source = get_template(name).template.source
                rendered = Template(source).render(Context({}))

                self.assertIn('miniSASS', rendered)
                self.assertIn('</html>', rendered, 'template did not render fully')

    def test_each_template_offers_a_way_back_into_the_site(self):
        """An error page that is a dead end just leaves the user stranded."""
        for name in ERROR_TEMPLATES:
            with self.subTest(template=name):
                rendered = Template(get_template(name).template.source).render(Context({}))
                self.assertIn('href="/"', rendered)


class ErrorTemplatesAreSelfContainedTest(TestCase):
    """
    Guards the rule that caused the outage: no inheritance, no includes, no
    custom tags, nothing fetched from another host.
    """

    # The explanatory header in each template names the very tags that must not
    # appear, so a naive substring search matches its own documentation. Strip
    # the comment block and check the part that actually renders.
    COMMENT_BLOCK = re.compile(
        r'\{%\s*comment\s*%\}.*?\{%\s*endcomment\s*%\}', re.DOTALL
    )

    def _source(self, name):
        raw = get_template(name).template.source
        return self.COMMENT_BLOCK.sub('', raw)

    def test_no_template_inheritance_or_includes(self):
        for name in ERROR_TEMPLATES:
            with self.subTest(template=name):
                source = self._source(name)
                self.assertNotIn('{% extends', source)
                self.assertNotIn('{% include', source)

    def test_no_custom_template_tag_libraries_are_loaded(self):
        for name in ERROR_TEMPLATES:
            with self.subTest(template=name):
                self.assertNotIn('{% load', self._source(name))

    def test_nothing_is_fetched_from_another_host(self):
        """
        The old 500 page pulled jQuery from code.jquery.com and a font from
        Google. An error page that waits on a third party to render is a bad
        error page, and it leaks the visit to that third party.
        """
        for name in ERROR_TEMPLATES:
            with self.subTest(template=name):
                source = self._source(name)
                external = re.findall(r'(?:src|href)\s*=\s*["\']https?://[^"\']+', source)
                self.assertEqual(external, [], f'{name} loads something external')

    def test_no_mailto_links_to_an_address_that_cannot_receive(self):
        """
        minisass.org publishes no MX record, so mail to info@ or support@ bounces.
        Pointing a stuck user at one is worse than giving them nothing: they
        write out the problem and it disappears. Reports go through the Contact
        Us form instead.
        """
        for name in ERROR_TEMPLATES:
            with self.subTest(template=name):
                source = self._source(name)
                self.assertNotIn('mailto:', source)
                self.assertIn('Contact Us', source)


class DjangoUsesTheseTemplatesTest(TestCase):
    """
    Writing the file is not enough - Django has to actually pick it up. 400.html
    and 403.html did not exist at all before, so those responses rendered
    Django's bare built-in pages.
    """

    def setUp(self):
        self.request = RequestFactory().get('/somewhere/')

    def test_404_handler_uses_the_project_template(self):
        response = page_not_found(self.request, Exception('missing'))
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'We can', response.content)

    def test_400_handler_uses_the_project_template(self):
        response = bad_request(self.request, Exception('bad'))
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'could not be processed', response.content)

    def test_403_handler_uses_the_project_template(self):
        response = permission_denied(self.request, Exception('denied'))
        self.assertEqual(response.status_code, 403)
        self.assertIn(b'access to that page', response.content)

    def test_csrf_failure_uses_the_project_template(self):
        """
        The most common of these in practice: a form left open long enough for
        its token to expire. Django's built-in page opens with "CSRF
        verification failed. Request aborted." and explains cookie internals.
        """
        response = csrf_failure(self.request, reason='CSRF token missing')
        self.assertEqual(response.status_code, 403)
        self.assertIn(b'session expired', response.content)
        # The raw reason describes the CSRF mechanism and means nothing to the
        # reader, so it must not be surfaced.
        self.assertNotIn(b'CSRF token missing', response.content)

    def test_a_missing_url_returns_404_rather_than_500(self):
        """The regression itself, end to end through the URL conf."""
        response = self.client.get('/this-url-does-not-exist/')
        self.assertEqual(response.status_code, 404)


class ErrorPageLinksAreValidTest(TestCase):
    """The links offered must actually resolve, or the page is still a dead end."""

    def test_linked_routes_all_exist(self):
        linked = set()
        for name in ERROR_TEMPLATES:
            source = get_template(name).template.source
            linked.update(re.findall(r'href="(/[a-z/-]*)"', source))

        self.assertTrue(linked, 'no internal links found to check')
        for url in sorted(linked):
            with self.subTest(url=url):
                # resolve() rather than a GET. The question here is whether the
                # URL matches a route, and fetching it would drag in the whole
                # SPA shell - which needs a built frontend that a fresh checkout
                # does not have, so the test would fail in CI for a reason with
                # nothing to do with the error pages.
                try:
                    resolve(url)
                except Resolver404:
                    self.fail(f'error pages link to {url}, which matches no route')

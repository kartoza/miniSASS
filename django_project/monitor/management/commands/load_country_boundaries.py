# coding=utf-8
"""Load world administrative boundaries into PostGIS.

Populates monitor.WorldCountry so that country lookup and ocean validation can be
answered from the database instead of an outbound WFS request to a third-party
GeoServer.

Default source is Natural Earth 1:10m Admin 0 Countries, which is public domain
(https://www.naturalearthdata.com/about/terms-of-use/). The 10m resolution matters:
coarser sets simplify coastlines enough that genuine river sites near the coast get
misclassified as ocean.

    python manage.py load_country_boundaries                  # download the default
    python manage.py load_country_boundaries --path local.geojson
    python manage.py load_country_boundaries --url https://.../countries.geojson

Re-running replaces the table contents inside a transaction.
"""

import json
import tempfile
import urllib.request

from django.contrib.gis.geos import GEOSGeometry, MultiPolygon
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from monitor.models import WorldCountry

DEFAULT_URL = (
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/'
    'geojson/ne_10m_admin_0_countries.geojson'
)


class Command(BaseCommand):
    help = 'Load world country boundaries into PostGIS for country/ocean lookup.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--url', default=DEFAULT_URL,
            help='GeoJSON URL to download (default: Natural Earth 10m admin 0).')
        parser.add_argument(
            '--path',
            help='Path to a local GeoJSON file. Takes precedence over --url.')
        parser.add_argument(
            '--if-empty', action='store_true',
            help=('Do nothing when boundaries are already loaded. Used by the '
                  'container entrypoint so start-up does not re-download the '
                  'dataset on every deploy.'))

    def handle(self, *args, **options):
        if options['if_empty'] and WorldCountry.objects.exists():
            self.stdout.write(
                f'{WorldCountry.objects.count()} country geometries already '
                f'loaded; nothing to do.')
            return

        path = options.get('path')
        if path:
            self.stdout.write(f'Reading {path} ...')
            with open(path, encoding='utf-8') as fd:
                data = json.load(fd)
        else:
            url = options['url']
            self.stdout.write(f'Downloading {url} ...')
            try:
                with urllib.request.urlopen(url, timeout=180) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
            except Exception as exc:
                raise CommandError(f'Could not download boundaries: {exc}')

        features = data.get('features') or []
        if not features:
            raise CommandError('No features found in the source data.')

        rows, skipped = [], 0
        for feature in features:
            props = feature.get('properties') or {}
            # ISO_A2_EH resolves several disputed/de-facto territories that ISO_A2
            # leaves as "-99".
            code = props.get('ISO_A2_EH') or props.get('ISO_A2') or ''
            code = str(code).strip().upper()
            if len(code) != 2:
                skipped += 1
                continue

            name = props.get('ADMIN') or props.get('NAME') or code

            try:
                geom = GEOSGeometry(json.dumps(feature['geometry']), srid=4326)
            except Exception:
                skipped += 1
                continue

            # Normalise to MultiPolygon so a single field type covers every feature.
            if geom.geom_type == 'Polygon':
                geom = MultiPolygon(geom, srid=4326)
            elif geom.geom_type != 'MultiPolygon':
                skipped += 1
                continue

            rows.append(WorldCountry(iso_a2=code, name=str(name)[:128], geom=geom))

        if not rows:
            raise CommandError('No usable country geometries were parsed.')

        with transaction.atomic():
            deleted = WorldCountry.objects.count()
            WorldCountry.objects.all().delete()
            WorldCountry.objects.bulk_create(rows, batch_size=50)

        self.stdout.write(self.style.SUCCESS(
            f'Loaded {len(rows)} country geometries '
            f'(replaced {deleted}, skipped {skipped} without a usable ISO code).'
        ))

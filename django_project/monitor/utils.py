import logging
import shutil
import requests
import os
import zipfile
from django.conf import settings
# Was previously missing, so get_country_from_coordinates_nominatim raised
# NameError, was swallowed by its own except clause and always returned ''.
from geopy.geocoders import Nominatim

logger = logging.getLogger(__name__)


def safe_save_field_file(field_file, out_dir, dst=None) -> str:
    """Save a Django FieldFile (which may be backed by S3/MinIO) to a local directory.

    Works with any storage backend by reading through the Django storage API
    instead of relying on a local filesystem path.

    :param field_file: A Django FieldFile instance (e.g. model.image).
    :param str out_dir: Directory to save the file into.
    :param str dst: Filename for the saved file. If None, use the original name.
    :return: Full path of the saved file.
    """
    name = dst or os.path.basename(field_file.name)
    base, extension = os.path.splitext(name)
    destination = os.path.join(out_dir, name)
    i = 1
    while os.path.exists(destination):
        destination = os.path.join(out_dir, f'{base}_{i}{extension}')
        i += 1
    field_file.open('rb')
    try:
        with open(destination, 'wb') as f:
            for chunk in field_file.chunks():
                f.write(chunk)
    finally:
        field_file.close()
    return destination


def safe_copy(file_path, out_dir, dst=None) -> str:
    """Safely copy a file to the specified directory. If a file with the same name already
    exists, the copied file name is altered to preserve both.

    :param str file_path: Path to the file to copy.
    :param str out_dir: Directory to copy the file into.
    :param str dst: New name for the copied file. If None, use the name of the original
        file.
    """
    name = dst or os.path.basename(file_path)
    final_name = name
    if not os.path.exists(os.path.join(out_dir, name)):
        destination = os.path.join(out_dir, name)
        shutil.copy(file_path, destination)
        final_name = destination
    else:
        base, extension = os.path.splitext(name)
        i = 1
        while os.path.exists(os.path.join(out_dir, '{}_{}{}'.format(base, i, extension))):
            i += 1
        destination = os.path.join(out_dir, '{}_{}{}'.format(base, i, extension))
        shutil.copy(file_path, destination)
        final_name = destination
    return final_name


def zip_directory(directory_path, zip_path):
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                zipf.write(
                    os.path.join(root, file),
                    os.path.relpath(
                        os.path.join(root, file),
                        os.path.join(directory_path, '..')
                    )
                )



def validate_coordinates(latitude, longitude):
    """Return (lat, lon) as floats, or raise ValueError with a usable message.

    Guards against transposed axes, which clients have sent before: sites exist in
    the database with latitude -122.08 / longitude 37.42 (the Android emulator's
    default location, with the two values the wrong way round). Those were stored
    silently, and PostGIS then coerced them into range for any geography operation.
    Rejecting them here gives a far clearer error than the ocean check's
    "Site is located in the ocean!".
    """
    try:
        lat = float(latitude)
        lon = float(longitude)
    except (TypeError, ValueError):
        raise ValueError('Latitude and longitude must be numbers.')

    if not -90 <= lat <= 90:
        raise ValueError(
            f'Latitude {lat} is out of range (-90 to 90). '
            'Check that latitude and longitude are not swapped.'
        )
    if not -180 <= lon <= 180:
        raise ValueError(
            f'Longitude {lon} is out of range (-180 to 180). '
            'Check that latitude and longitude are not swapped.'
        )
    return lat, lon


def get_country_from_coordinates_nominatim(latitude, longitude):
    """Look up an ISO 3166-1 alpha-2 country code via OpenStreetMap Nominatim.

    Used as a fallback when the WFS service is unavailable. Note that Nominatim's
    public instance enforces a strict usage policy (roughly one request per
    second), so it is not suitable as the primary lookup for bulk traffic.
    """
    if not getattr(settings, 'ENABLE_GEOCODING', True):
        return ''

    try:
        geocoder = Nominatim(user_agent="minisass")
        location = geocoder.reverse(f"{latitude}, {longitude}").raw
        return location.get('address', {}).get('country_code', 'N/A').upper()
    except Exception:
        return ''


def get_country_from_coordinates_db(latitude, longitude):
    """Resolve a coordinate to an ISO country code using local PostGIS data.

    Returns the ISO 3166-1 alpha-2 code, or None if monitor.WorldCountry has not
    been populated (so the caller can fall back to the remote service).

    Raises ValueError when the point intersects no country, which is how a site in
    the ocean is rejected. That matches the contract of the WFS implementation.
    """
    # Imported lazily: this module is imported by monitor.models, so importing the
    # model at module scope would be circular.
    from django.contrib.gis.geos import Point
    from django.db import connection
    from monitor.models import WorldCountry

    if not WorldCountry.objects.exists():
        return None

    lat, lon = float(latitude), float(longitude)
    point = Point(lon, lat, srid=4326)

    match = WorldCountry.objects.filter(geom__intersects=point).first()
    if match is not None:
        return match.iso_a2.upper()

    # Nothing contains the point. Before calling it ocean, allow a small coastal
    # tolerance: river-mouth sites legitimately sit a few hundred metres outside a
    # simplified coastline. Measured against real data, genuine coastal sites were
    # 0.16-1.03 km offshore while sites with transposed lat/lon were 840+ km out,
    # so a couple of kilometres separates the two cleanly.
    tolerance_m = getattr(settings, 'COUNTRY_LOOKUP_COASTAL_TOLERANCE_M', 2000)
    if tolerance_m and tolerance_m > 0:
        table = WorldCountry._meta.db_table
        # Raw SQL so the distance is unambiguously in metres via a geography cast.
        with connection.cursor() as cursor:
            cursor.execute(
                f'''
                SELECT iso_a2
                FROM {table}
                WHERE ST_DWithin(
                        geom::geography,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                        %s)
                ORDER BY ST_Distance(
                        geom::geography,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography)
                LIMIT 1
                ''',
                [lon, lat, tolerance_m, lon, lat],
            )
            row = cursor.fetchone()
        if row:
            logger.info(
                'Coordinate (%s, %s) fell just outside land; resolved to %s '
                'within the %sm coastal tolerance.', lat, lon, row[0], tolerance_m
            )
            return row[0].upper()

    raise ValueError("Site is located in the ocean!")


def get_country_from_coordinates(latitude, longitude):
    """Resolve a coordinate to an ISO country code, rejecting ocean locations.

    Prefers the local PostGIS boundaries loaded by "manage.py
    load_country_boundaries". Falls back to the configured WFS service only when
    that table is empty, so existing deployments keep working until the data is
    loaded.
    """
    if not getattr(settings, 'ENABLE_GEOCODING', True):
        return ''

    country = get_country_from_coordinates_db(latitude, longitude)
    if country is not None:
        return country

    logger.warning(
        'monitor.WorldCountry is empty, falling back to the remote WFS lookup. '
        'Run "manage.py load_country_boundaries" to remove this dependency.'
    )
    return get_country_from_coordinates_wfs(latitude, longitude)


def get_country_from_coordinates_wfs(latitude, longitude):
    """Resolve a coordinate to an ISO country code, and reject ocean locations.

    This doubles as site validation: a coordinate that intersects no country
    polygon is treated as being in the ocean and raises ValueError, which
    SiteForm turns into a user-facing validation error.

    The service is configurable so this deployment is not tied to any single
    provider. Point COUNTRY_LOOKUP_WFS_URL / _TYPENAME / _GEOMETRY at an
    IWMI-hosted world-boundaries layer to remove the external dependency.
    """
    if not getattr(settings, 'ENABLE_GEOCODING', True):
        return ''

    url = settings.COUNTRY_LOOKUP_WFS_URL
    params = {
        "SERVICE": "WFS",
        "VERSION": "1.1.0",
        "REQUEST": "GetFeature",
        "TYPENAME": settings.COUNTRY_LOOKUP_WFS_TYPENAME,
        "SRSNAME": "EPSG:4326",
        "OUTPUTFORMAT": "application/json",
        "PROPERTYNAME": "ISO_A2,ADMIN",
        "CQL_FILTER": (
            f"INTERSECTS({settings.COUNTRY_LOOKUP_WFS_GEOMETRY},"
            f"POINT({latitude} {longitude}))"
        )
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data.get('numberReturned', 0) == 0:
            raise ValueError("Site is located in the ocean!")
        else:
            return data['features'][0]['properties']['ISO_A2'].upper()
    except requests.exceptions.Timeout:
        raise ValueError("Ocean validation timed out. Please try again later.")
    except requests.exceptions.ConnectionError:
        raise ValueError("Could not connect to validation service. Please check your network connection.")
    except requests.exceptions.HTTPError as e:
        raise ValueError(f"Ocean validation service error: {e}")
    except ValueError:
        raise
    except Exception:
        raise ValueError(f"Unexpected error during ocean validation!")

import os
import boto3
from django.conf import settings
from sentry_sdk import capture_exception

# Absolute filesystem path to the Django project directory:
DJANGO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def absolute_path(*args):
    """Return absolute path of django project."""
    return os.path.join(DJANGO_ROOT, *args)


def delete_file_field(file_field):
    """Delete actual file from file_field."""
    if file_field:
        try:
            if os.path.isfile(file_field.path):
                os.remove(file_field.path)
        except Exception:
            pass


def get_s3_client():
    return boto3.client(
        's3',
        endpoint_url=settings.MINIO_ENDPOINT,
        aws_access_key_id=settings.MINIO_ACCESS_KEY,
        aws_secret_access_key=settings.MINIO_SECRET_KEY
    )


def delete_from_minio(key: str, bucket: str=None):
    """
    Delete file from minIO.
    """
    bucket = bucket or settings.MINIO_AI_BUCKET

    s3 = get_s3_client()
    try:
        s3.delete_object(
            Bucket=bucket,
            Key=key,
        )
    except Exception as e:
        if settings.SENTRY_KEY:
            capture_exception(e)


def send_to_minio(source, destination, bucket):
    """
    Send file to minio/S3
    """

    s3 = get_s3_client()
    try:
        s3.upload_file(source, bucket, destination)
    except Exception as e:
        if settings.SENTRY_KEY:
            capture_exception(e)


def get_path_string(string: str):
    """
    Get string in all lowercase, and space converted to udnerscore.
    Example: True flies will be converted to true_flies
    """
    return string.lower().replace(' ', '_')

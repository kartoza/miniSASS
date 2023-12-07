import os

# Absolute filesystem path to the Django project directory:
DJANGO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def absolute_path(*args):
    """Return absolute path of django project."""
    return os.path.join(DJANGO_ROOT, *args)


def delete_file_field(file_field):
    """Delete actual file from file_field."""
    if file_field:
        if os.path.isfile(file_field.path):
            os.remove(file_field.path)

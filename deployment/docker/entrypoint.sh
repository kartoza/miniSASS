#!/bin/sh

# Exit script in case of error
set -e

echo $"\n\n\n"
echo "-----------------------------------------------------"
echo "STARTING DJANGO ENTRYPOINT $(date)"
echo "-----------------------------------------------------"

# Run initialization
cd /home/web/django_project
echo 'Initialize project.'
python manage.py collectstatic --clear --noinput
python manage.py migrate

# Load data from fixture files
echo 'Loading fixture data.'
python manage.py loaddata --ignore fixtures/*.json

echo "-----------------------------------------------------"
echo "FINISHED DJANGO ENTRYPOINT --------------------------"
echo "-----------------------------------------------------"

# Run the CMD
exec "$@"

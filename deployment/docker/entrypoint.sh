#!/bin/bash

# Exit script in case of error
set -e

echo $"\n\n\n"
echo "-----------------------------------------------------"
echo "STARTING DJANGO ENTRYPOINT $(date)"
echo "-----------------------------------------------------"

# Run initialization

if [[ ! -d /home/web/django_project/minisass_frontend/node_modules || "${DEV_SETUP}" =~ [Tt][Rr][Uu][Ee] ]]; then
  pushd /home/web/django_project/minisass_frontend || exit
  npm install --legacy-peer-deps && npm run build
fi

pushd /home/web/django_project || exit
echo 'Initialize project.'
python manage.py collectstatic --clear --noinput
python manage.py migrate

# Run tests
echo 'Running tests.'
python manage.py test

echo "-----------------------------------------------------"
echo "FINISHED DJANGO ENTRYPOINT --------------------------"
echo "-----------------------------------------------------"

# Run the CMD
exec "$@"

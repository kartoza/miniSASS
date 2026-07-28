#!/bin/bash

# Exit script in case of error
set -e

echo $"\n\n\n"
echo "-----------------------------------------------------"
echo "STARTING DJANGO ENTRYPOINT $(date)"
echo "-----------------------------------------------------"

# Run initialization

if [ -z "${DEV_SETUP}" ]; then
	DEV_SETUP=FALSE
fi

if [[ "${DEV_SETUP}" =~ [Tt][Rr][Uu][Ee] ]]; then
  pushd /home/web/django_project/minisass_frontend || exit
  npm install --legacy-peer-deps && npm run build
fi

echo "Dropping view in the DB"

export PGPASSWORD="${POSTGRES_PASS}"

psql -d "${DJANGO_DB}" -p 5432 -U "${POSTGRES_USER}" -h "${DATABASE_HOST}" -c 'DROP VIEW IF EXISTS public.minisass_observations;'

# -tA is required: without it psql prints a header, a separator and a "(1 row)"
# footer, so the comparison below never matched "t" and these DDL scripts were
# re-applied on every single container start, erroring the whole way through.
RESULT=$(psql -tA -d "${DJANGO_DB}" -U "${POSTGRES_USER}" -p 5432 -h "${DATABASE_HOST}" -c "SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_countries')")
if [ "${RESULT}" != "t" ]; then
  psql -d "${DJANGO_DB}" -p 5432 -U "${POSTGRES_USER}" -h "${DATABASE_HOST}" -f /home/web/django_project/webmapping/sql/admin_countries.sql
  psql -d "${DJANGO_DB}" -p 5432 -U "${POSTGRES_USER}" -h "${DATABASE_HOST}" -f /home/web/django_project/webmapping/sql/intersect.sql

fi


pushd /home/web/django_project || exit
echo 'Initialize project.'
python manage.py collectstatic --noinput #--clear
python manage.py migrate


echo 'Creating superuser...'

# No default credentials are baked in on purpose. This script previously fell back
# to a hardcoded username, email and password that were committed to the
# repository, which meant any deployment that forgot to set these variables came
# up with a publicly known administrator account.
if [ -z "${DJANGO_SUPERUSER_USERNAME}" ] || [ -z "${DJANGO_SUPERUSER_PASSWORD}" ] || [ -z "${DJANGO_SUPERUSER_EMAIL}" ]; then
  echo 'DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD'
  echo 'are not all set - skipping superuser creation.'
else
  # create super user if one doesn't exist
  python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('${DJANGO_SUPERUSER_USERNAME}', '${DJANGO_SUPERUSER_EMAIL}', '${DJANGO_SUPERUSER_PASSWORD}')" 2>/dev/null || echo 'Superuser already exists, skipping.'
fi

psql -d "${DJANGO_DB}" -p 5432 -U "${POSTGRES_USER}" -h "${DATABASE_HOST}" -f /home/web/django_project/webmapping/sql/observation.sql


echo "Loading fixtures"
python manage.py load_fixtures

# World boundaries for country lookup and the "is this site in the ocean?" check.
#
# The command is a no-op once the table is populated, so this only does real work
# on the first start after deployment. It is deliberately non-fatal: if the
# download fails, monitor.utils falls back to the remote WFS service and the site
# still works, so a transient network problem must not stop the container booting.
#
# This runs here rather than being run by hand because ECS exec is disabled on the
# service, so there is no way to invoke a management command against a running task.
echo "Ensuring world boundaries are loaded"
python manage.py load_country_boundaries --if-empty || \
    echo "WARNING: could not load world boundaries; falling back to the remote lookup."

echo "-----------------------------------------------------"
echo "FINISHED DJANGO ENTRYPOINT --------------------------"
echo "-----------------------------------------------------"

# Run the CMD
exec "$@"

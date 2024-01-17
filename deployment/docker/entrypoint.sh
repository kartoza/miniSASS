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

pushd /home/web/django_project || exit
echo 'Initialize project.'
python manage.py collectstatic --clear --noinput
python manage.py migrate


echo 'Creating superuser...'

if [ -z "${DJANGO_SUPERUSER_USERNAME}" ]; then
    DJANGO_SUPERUSER_USERNAME=kartoza_admin
fi
if [ -z "${DJANGO_SUPERUSER_PASSWORD}" ]; then
    DJANGO_SUPERUSER_PASSWORD="Gs10w29k8*&"
fi
if [ -z "${DJANGO_SUPERUSER_EMAIL}" ]; then
    DJANGO_SUPERUSER_EMAIL=tinashe@kartoza.com
fi
# create super user if one doesn't exist
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('${DJANGO_SUPERUSER_USERNAME}', '${DJANGO_SUPERUSER_EMAIL}', '${DJANGO_SUPERUSER_PASSWORD}')" 2>/dev/null || echo 'Superuser already exists, skipping.'


# Run tests
echo 'Running tests.'
python manage.py test

psql -d "${DJANGO_DB}" -p 5432 -U "${POSTGRES_USER}" -h "${DATABASE_HOST}" -c 'CREATE OR REPLACE VIEW public.minisass_observations
 AS
 SELECT sites.gid AS sites_gid,
    sites.river_name,
    sites.site_name,
    sites.description as site_description,
    sites.river_cat,
    observations.gid AS observations_gid,
    observations.score,
    observations.water_clarity,
    observations.water_temp,
    observations.ph,
    observations.diss_oxygen,
    observations.diss_oxygen_unit,
    observations.elec_cond,
    observations.elec_cond_unit,
    observations.obs_date,
    observations.comment,
    observations.flatworms,
    observations.worms,
    observations.leeches,
    observations.crabs_shrimps,
    observations.stoneflies,
    observations.minnow_mayflies,
    observations.other_mayflies,
    observations.damselflies,
    observations.dragonflies,
    observations.bugs_beetles,
    observations.caddisflies,
    observations.true_flies,
    observations.snails,
    observations.flag,
    auth_user.username,
    minisass_authentication_userprofile.organisation_name,
    minisass_authentication_lookup.description AS organisation_type,
	sites.the_geom,
    st_x(sites.the_geom) AS x,
    st_y(sites.the_geom) AS y
   FROM sites
     LEFT JOIN observations ON sites.gid = observations.site_id
     LEFT JOIN auth_user ON observations.user_id = auth_user.id
     LEFT JOIN minisass_authentication_userprofile ON auth_user.id = minisass_authentication_userprofile.user_id
     LEFT JOIN minisass_authentication_lookup ON minisass_authentication_userprofile.organisation_type_id = minisass_authentication_lookup.id
	 LEFT JOIN monitor_siteimage ON sites.gid = monitor_siteimage.site_id
	 LEFT JOIN monitor_observationpestimage ON observations.gid = monitor_observationpestimage.observation_id
  ORDER BY observations.obs_date;'

echo "-----------------------------------------------------"
echo "FINISHED DJANGO ENTRYPOINT --------------------------"
echo "-----------------------------------------------------"

# Run the CMD
exec "$@"

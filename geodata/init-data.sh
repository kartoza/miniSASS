#!/usr/bin/env bash

###
# Setting up the spatial data layers, Layers marked Optional form part of the Rivers and Catchments base map on minisass.org.
# You can load your own layers and publish them yourself using a web map server such as Geoserver or QGIS server,
# or fetch the basemap from the minisass Geoserver WMS.
###

###
# Rivers and dams (optional)
# Download from http://www.dwa.gov.za/iwqs/gis_data/river/rivs500k.html
###

wget --progress=bar:force:noscroll -c --tries=2 http://www.dwa.gov.za/iwqs/gis_data/river/All.zip -O /data/rivers.zip

unzip /data/rivers.zip -d /data/rivers

for file in `ls *.shp`;do ogr2ogr -progress -append -skipfailures -a_srs "EPSG:4326" -nlt PROMOTE_TO_MULTI -f "PostgreSQL" PG:"dbname='${POSTGRES_DB}' host=localhost port=5432 user='docker' password='${POSTGRES_PASS}' sslmode=allow" /data/rivers/$file  ;done

rm -rf /data/rivers*

wget --progress=bar:force:noscroll -c --tries=2 http://www.dwa.gov.za/iwqs/gis_data/river/dams500g.zip -O /data/dams.zip

for file in `ls *.shp`;do ogr2ogr -progress -append -skipfailures -a_srs "EPSG:4326" -nlt PROMOTE_TO_MULTI -f "PostgreSQL" PG:"dbname='${POSTGRES_DB}' host=localhost port=5432 user='docker' password='${POSTGRES_PASS}' sslmode=allow" /data/dams/$file  ;done

rm -rf /data/dams*


###
# Catchments and WMAs (optional)
# Download from download from here: http://www.dwaf.gov.za/Dir_BI/SLIMDownload/%28S%28gd31jnee31s4nwzcqbf1qu20%29%29/Default.aspx
###

wget --progress=bar:force:noscroll -c --tries=2 http://www.dwa.gov.za/iwqs/wms/data/hca_1-geo_polygon.kmz -O /data/hca_1-geo_polygon.kmz
wget --progress=bar:force:noscroll -c --tries=2 http://www.dwa.gov.za/iwqs/wms/data/hca_2-geo_polygon.kmz -O /data/hca_2-geo_polygon.kmz
wget --progress=bar:force:noscroll -c --tries=2 http://www.dwa.gov.za/iwqs/wms/data/hca_3-geo_polygon.kmz -O /data/hca_3-geo_polygon.kmz
wget --progress=bar:force:noscroll -c --tries=2 http://www.dwa.gov.za/iwqs/wms/data/hca_4-geo_polygon.kmz -O /data/hca_4-geo_polygon.kmz

for file in `ls *.kmz`;do ogr2ogr -progress -append -skipfailures -a_srs "EPSG:4326" -nlt PROMOTE_TO_MULTI -f "PostgreSQL" PG:"dbname='${POSTGRES_DB}' host=localhost port=5432 user='docker' password='${POSTGRES_PASS}' sslmode=allow" /data/$file  ;done

rm -rf /data/hca_*

###
# Admin boundaries (optional)
# Download from download from here: https://www.demarcation.org.za/ward-delimitation-2019-2020/
###

#TODO - Add download links for districts,provinces,municipalities

for file in `ls *.kmz`;do ogr2ogr -progress -append -skipfailures -a_srs "EPSG:4326" -nlt PROMOTE_TO_MULTI -f "PostgreSQL" PG:"dbname='${POSTGRES_DB}' host=localhost port=5432 user='docker' password='${POSTGRES_PASS}' sslmode=allow" /data/$file  ;done



--------------

###
# 1:50000 rivers (optional)
# The DWAF 1:500000 rivers are well connected and named but the NGI 1:50000 rivers show more detail of the
# smaller rivers users might sample and are more spatially accurate at large scales.
#Prepare the 1:50000 rivers according to the topostyle project. In our case we dumped the riverline
# table from a local topostyle database, transferred it to the minisass server and restored it.
#Then we indexed and clustered it and set permissions, then published and styled it, again with the
# topostyle style, which we set to switch over from the 1:500000 rivers at an appropriate scale.
###

#TODO - Add download links for NGI 1in50k and DWA rivers and ingestion logic


Schools (mandatory)
-------

###
# Admin boundaries (optional)
# download from the GitHub miniSASS repository: webmapping/spatial_data/schools.* or https://data.humdata.org/dataset/hotosm_zaf_education_facilities?
###

for file in `ls *.kmz`;do ogr2ogr -progress -append -skipfailures -a_srs "EPSG:4326" -nlt PROMOTE_TO_MULTI -f "PostgreSQL" PG:"dbname='${POSTGRES_DB}' host=localhost port=5432 user='docker' password='${POSTGRES_PASS}' sslmode=allow" /data/$file  ;done



----------------------

###
# miniSASS sample points (optional)
#
###

cat > /data/postgis.sql <<EOF


    CREATE TABLE sites
    (
      gid serial NOT NULL,
      the_geom geometry(Point,4326),
      name character varying(100),
      description character varying(255),
      river_cat character varying(5), --'sandy' or 'rocky', Django list
      user_id integer,
      time_stamp timestamp without time zone,
      CONSTRAINT sites_pk PRIMARY KEY (gid )
    );

    CREATE INDEX sites_geom_idx
      ON sites
      USING gist
      (the_geom );

    --SELECT setval('public.sites_gid_seq', 0, true);
    INSERT INTO sites (the_geom,name)
    SELECT ST_PointFromText('POINT('||longitude||' '||latitude||')', 4326), site_name
    FROM sample_temp;

    CREATE TABLE observations
    (
      gid serial NOT NULL,
      user_id integer,
      flatworms boolean,
      worms boolean,
      leeches boolean,
      crabs_shrimps boolean,
      stoneflies boolean,
      minnow_mayflies boolean,
      other_mayflies boolean,
      damselflies boolean,
      dragonflies boolean,
      bugs_beetles boolean,
      caddisflies boolean,
      true_flies boolean,
      snails boolean,
      score numeric(4,2),
      site integer,
      time_stamp timestamp without time zone,
      comment character varying(255),
      CONSTRAINT observations_pk PRIMARY KEY (gid )
    );

    INSERT INTO observations (site)
    SELECT gid
    FROM sites;

    ALTER TABLE sample_temp ADD UNIQUE (site_name);

    UPDATE observations o SET score = s.mini_sass_, time_stamp = s.date_iso,comment = s.comment
    FROM (SELECT s.*,t.comment,t.mini_sass_,t.date_iso::timestamp without time zone FROM sites s INNER JOIN sample_temp t on s.name = t.site_name) s
    WHERE site = s.gid;

    ALTER TABLE observations ADD FOREIGN KEY (site) REFERENCES sites (gid) ON UPDATE NO ACTION ON DELETE NO ACTION;

    DROP TABLE sample_temp;
    CREATE OR REPLACE VIEW public.minisass_observations
     AS
     SELECT sites.gid AS sites_gid,
        sites.the_geom,
        st_x(sites.the_geom) AS x,
        st_y(sites.the_geom) AS y,
        sites.river_name,
        sites.site_name,
        sites.description,
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
        minisass_registration_userprofile.organisation_name,
        minisass_registration_lookup.description AS organisation_type
       FROM sites
         LEFT JOIN observations ON sites.gid = observations.site
         LEFT JOIN auth_user ON observations.user_id = auth_user.id
         LEFT JOIN minisass_registration_userprofile ON auth_user.id = minisass_registration_userprofile.user_id
         LEFT JOIN minisass_registration_lookup ON minisass_registration_userprofile.organisation_type_id = minisass_registration_lookup.id
      ORDER BY observations.obs_date;

ALTER TABLE public.minisass_observations
    OWNER TO minisass;

GRANT SELECT ON TABLE public.minisass_observations TO pg_read_all_data;
CREATE ROLE geoserver WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'myawesomegeoserver';
GRANT pg_read_all_data TO geoserver;
EOF

psql  -d ${db} -p 5432 -U ${POSTGRES_USER} -h localhost -f postgis.sql





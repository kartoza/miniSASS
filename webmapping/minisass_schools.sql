--Document describing procedure used to incoperate schools shapefiles and other countries into the database

-- load schools into db
-- shp2pgsql -s 4326 -c -D -W LATIN1 Schools_in_Namibia namibia_schools | psql -d minisass-cms
-- adding a new column into the schools table

  ALTER TABLE schools ADD COLUMN country character varying(30);

--updating all the schools that are within South Africa

 UPDATE schools set country = 'South Africa';

-- adding a new column into the namibia_schools table

 ALTER TABLE namibia_schools ADD COLUMN country character varying(30);

--updating the schools within Namibia to fall in there correct category

 UPDATE namibia_schools set country = 'Namibia';

--combining both tables (schools and namibia_schools) to be one so as to facilitate styling them with one sld

INSERT INTO schools (province, school, longitude,latitude, the_geom, country) select region,new_name,x_coord,y_coord,geom,country from namibia_schools;

--clean up

DROP TABLE namibia_schools;

--combining the shapefiles for sorrounding countries to merge with the shapefile for South Africa.

--load all the shapefiles  for neighbouring countries into postgis using shp2pgsql

shp2pgsql -s 4326 -c -D -W LATIN1 neighbours | psql -p 5433 -d minisass-cms

--combining all the tables into one table for all countries. insert all values from one table into another

 ALTER TABLE provinces ADD COLUMN country character varying(30);
 UPDATE provinces set country = 'South Africa';

INSERT INTO provinces (province,country,the_geom) select name_1, name_0,the_geom from neighbours;

drop table neighbours;



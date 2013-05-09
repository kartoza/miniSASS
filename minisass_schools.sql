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

shp2pgsql -s 4326 -c -D -W LATIN1 nameofshapefile  tablename | psql -p 5433 -d minisass-cms

--combining all the tables into one table for all countries. insert all values from one table into another

INSERT INTO botswana(id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom) 
select id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom from mozambique;

INSERT INTO botswana(id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom) 
select id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom from namibia;

INSERT INTO botswana(id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom) 
select id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom from lesotho;

INSERT INTO botswana(id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom) 
select id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom from zimbabwe;

INSERT INTO botswana(id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom) 
select id_0,iso,name_0,id_1, name_1, nl_name_1,varname_1,type_1,engtype_1,geom from swaziland;

--then rename the table botswana to be neigbouring countries

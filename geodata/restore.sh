#!/usr/bin/env bash

# Useful to restore a previous instance of database

export PGPASSWORD="${POSTGRES_PASS}"

psql -d minisass -p 5432 -U ${POSTGRES_USER} -h localhost -f /data/globals.sql

pg_restore -d minisass -p 5432 -U ${POSTGRES_USER} -h localhost /data/minisass.dmp

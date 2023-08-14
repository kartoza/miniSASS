#!/usr/bin/env bash

# Useful to restore a previous instance of database

export PGPASSWORD="${POSTGRES_PASS}"


for db in $(echo ${POSTGRES_DB} | tr ',' ' '); do
  pg_restore -d ${db} -p 5432 -U ${POSTGRES_USER} -h localhost /data/${db}.dmp
done
#!/bin/bash

if [[ ${SERVER_MODE} =~ [Dd][Ee][Vv][Ee][Ll][Oo][Pp] ]]; then
    echo "develop settings"
    python manage.py runserver 8080
else
    echo "Production settings"
    uwsgi --ini /uwsgi.conf
fi
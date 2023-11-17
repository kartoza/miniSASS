#--------- Generic stuff all our Dockerfiles should start with so we get caching ------------
FROM python:2.7.18-buster
MAINTAINER Admire Nyakudya<admire@kartoza.com>


# Install system dependencies
RUN apt-get update && \
    apt-get install -y libgdal-dev libcurl4-gnutls-dev librtmp-dev libssl-dev  binutils libproj-dev gdal-bin &&  \
    pip install uwsgi setuptools;pip uninstall -y wheel


RUN curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install nodejs -y

ADD ./django_project /home/web/django_project
ADD ./deployment/docker/requirements.txt /REQUIREMENTS.txt
RUN pip install --no-deps -r /REQUIREMENTS.txt

ADD ./deployment/docker/libgeos.py /usr/local/lib/python2.7/site-packages/django/contrib/gis/geos/libgeos.py
ADD ./deployment/docker/trans_real.py /usr/local/lib/python2.7/site-packages/django/utils/translation/trans_real.py

WORKDIR /home/web/django_project/minisass_frontend
RUN npm install --legacy-peer-deps && npm run build

WORKDIR /home/web/django_project

ADD ./deployment/docker/uwsgi.conf /uwsgi.conf
ADD ./deployment/docker/entrypoint.sh /entrypoint.sh
RUN chmod 0755 /entrypoint.sh

# Open port 8080 as we will be running our uwsgi socket on that
EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["uwsgi", "--ini", "/uwsgi.conf"]

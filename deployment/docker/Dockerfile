#--------- Generic stuff all our Dockerfiles should start with so we get caching ------------
FROM python:2.7.18-buster
MAINTAINER Admire Nyakudya<admire@kartoza.com>


# Install system dependencies
RUN apt-get update && \
    apt-get install -y libgdal-dev libcurl4-gnutls-dev librtmp-dev libssl-dev  binutils libproj-dev gdal-bin &&  \
    pip install uwsgi setuptools

ADD requirements.txt /REQUIREMENTS.txt
RUN pip install --upgrade -r /REQUIREMENTS.txt

ADD libgeos.py /usr/local/lib/python2.7/site-packages/django/contrib/gis/geos/libgeos.py
#RUN sed -i 's/geos_version().decode()/geos_version().decode().split(\x27 \x27)/g' /usr/local/lib/python2.7/site-packages/django/contrib/gis/geos/libgeos.py
#USER www-data
#ADD ../django_project /home/web/django_project
WORKDIR /home/web/django_project


ADD uwsgi.conf /uwsgi.conf
ADD run.sh /run.sh
RUN chmod 0755 /run.sh


# Open port 8080 as we will be running our uwsgi socket on that
EXPOSE 8080
EXPOSE 8000

CMD ["/bin/bash", "/run.sh"]
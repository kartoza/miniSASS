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
#RUN sed -i 's/geos_version().decode()/geos_version().decode().split(\x27 \x27)/g' /usr/local/lib/python2.7/site-packages/django/contrib/gis/geos/libgeos.py
#USER www-data
# ADD ./django_project /home/web/django_project

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY ./django_project/minisass_frontend/package.json ./django_project/minisass_frontend/package-lock.json /app/

# Install project dependencies
RUN npm install

# Copy the rest of the frontend source code to the container
COPY ./django_project/minisass_frontend /app

# Build the frontend
RUN npm run build


WORKDIR /home/web/django_project
RUN python manage.py collectstatic --noinput
ADD ./deployment/docker/uwsgi.conf /uwsgi.conf
ADD ./deployment/docker/run.sh /run.sh
RUN chmod 0755 /run.sh


# Open port 8080 as we will be running our uwsgi socket on that
EXPOSE 8080

CMD ["/bin/bash", "/run.sh"]

# Use the official Python image with version 3.11 as the base image
FROM python:3.11-buster

# Set the maintainer label
LABEL maintainer="Admire Nyakudya <admire@kartoza.com>"

# Install system dependencies
RUN apt-get update && \
    apt-get install -y postgresql-client nano libgdal-dev libcurl4-gnutls-dev librtmp-dev libssl-dev binutils libproj-dev gdal-bin && \
    pip install uwsgi setuptools && pip uninstall -y wheel

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install nodejs -y

# Copy your Django project to /home/web/django_project
ADD ./django_project /home/web/django_project

# Copy requirements.txt to the root directory
ADD ./deployment/docker/requirements.txt /REQUIREMENTS.txt

# Install Python dependencies from requirements.txt
RUN pip install --no-deps -r /REQUIREMENTS.txt

# Copy necessary files to the appropriate locations this was to handle compatibility issues on earlier versions of django
# ADD ./deployment/docker/libgeos.py /usr/local/lib/python3.11/site-packages/django/contrib/gis/geos/libgeos.py
# ADD ./deployment/docker/trans_real.py /usr/local/lib/python3.11/site-packages/django/utils/translation/trans_real.py

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY ./django_project/minisass_frontend/package.json ./django_project/minisass_frontend/package-lock.json /app/

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code to the container
COPY ./django_project/minisass_frontend /app

# Build the frontend
RUN npm run build

WORKDIR /home/web/django_project
ADD ./deployment/docker/uwsgi.conf /uwsgi.conf
ADD ./deployment/docker/run.sh /run.sh
ADD ./deployment/docker/migrate.sh /migrate.sh
RUN chmod 0755 /run.sh

# Open port 8080 as we will be running our uwsgi socket on that
EXPOSE 8080

# CMD ["/bin/bash", "/run.sh"]
CMD ["/bin/bash", "/migrate.sh"]

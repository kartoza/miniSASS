# Use the official Python image with version 3.11 as the base image
FROM python:3.11-buster

# Set the maintainer label
LABEL maintainer="Admire Nyakudya <admire@kartoza.com>"


# Install system dependencies
RUN apt-get update && \
    apt-get install -y postgresql-client nano libgdal-dev libcurl4-gnutls-dev librtmp-dev libssl-dev  binutils libproj-dev gdal-bin &&  \
    pip install uwsgi setuptools;pip uninstall -y wheel


RUN curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install nodejs -y

ADD ./django_project /home/web/django_project
ADD ./deployment/docker/requirements.txt /REQUIREMENTS.txt
RUN pip install --no-deps -r /REQUIREMENTS.txt

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

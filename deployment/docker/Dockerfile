# Use the official Python image with version 3.11 as the base image
FROM python:3.11-buster AS prod

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
RUN pip install -r /REQUIREMENTS.txt

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


FROM prod as dev

# This section taken on 2 July 2015 from
# https://docs.docker.com/examples/running_ssh_service/
# Sudo is needed by pycharm when it tries to pip install packages
RUN apt-get update && apt-get install -y openssh-server sudo
RUN mkdir /var/run/sshd
RUN echo 'root:docker' | chpasswd
RUN sed -i 's/^PermitRootLogin */#PermitRootLogin /' /etc/ssh/sshd_config
RUN echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# --------------------------------------------------------
# Open ports as needed
# --------------------------------------------------------

# Open port 8080 as we will be running our django dev server on
EXPOSE 8080
# Open port 22 as we will be using a remote interpreter from pycharm
EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
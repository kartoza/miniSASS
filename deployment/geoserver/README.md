# Migration of Geoserver to docker-compose

## Installation of docker and docker-compose

This is a once off task that is required to install the packages for docker 
and docker-compose

The detailed instructions for installing [docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)
and [docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04)
is explained in the links provided.

## Procedure

* Clone the kartoza geoserver docker repository using the following 
    ```bash
    git clone https://github.com/kartoza/docker-geoserver.git
    ```
**Note:** This should be done in your preferred deployment folder i.e `/home/web/`
* Change directory into the cloned repository
* Download the two files in the minisass repository `deployment/geoserver` to 
overwrite the `docker-compose.yml` and `.env` with the ones in this repository
* Open the file `.env` and customise the environment variables mainly focusing on
    ```bash
    SERVER_IP_ADDRESS=127.0.0.1
    GEOSERVER_PORT=8600
    ```
**Note** You will also need to adjust the other variables supported by the container
to get a fully functional Geoserver container which can be used in production. Full reference
is available from [kartoza geoserver](https://github.com/kartoza/docker-geoserver)

## Configuring changes in GeoServer

* After updating the configurations, spin up the container by running:
    ```bash
    docker-compose up -d
    ```
* Wait a couple of minutes and the service should be available from the same port and host
as the previous installed version.
* Login to the web portal of GeoServer.
* Navigate to the stores and update the store that is available changing the following
    ```bash
    host=${SERVER_IP_ADDRESS}
    ```
* Also make sure the `enabled` option is ticked for the store.
* Check if layers are rendering and if caching is available.


## Other optimisations

The initial stack was done some time back and they are a lot of things that could
be done to improve this.

* Use geowebcache with PostgreSQL database.
* Setup proxy base url in GeoServer during deployment.
* Use extensions like MBTiles blobs to cache the data. This prevents inodes issues on servers
that are not properly configured to store millions of small files
* Migrate the PostgreSQL database to the latest supported version and run it in docker



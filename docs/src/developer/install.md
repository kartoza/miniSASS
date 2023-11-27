# Installing miniSASS Django-CMS project

This is currently a basic Django-CMS site. No extra Django applications have been added yet. 
To install the pre-requisites needed for this site to run, do the following:

## Docker Deployments

* Clone the repository

    ```bash
     git clone git@github.com:kartoza/miniSASS.git
     cd miniSASS
    ```

* Copy the `.example.env` file and adjust the environment variables to match your requirements.

    ```bash
    cp .example.env .env
    ```

* Prepare the sample data to load into your PostgreSQL database. If you need to load
the data when initialising the containers you need to update the `docker-compose.yml`
so that you can mount the `import-data.sh` script instead of the `restore.sh`
script as per the instruction of running scripts in [docker-postgis](https://github.com/kartoza/docker-postgis#running-sql-scripts-on-container-startup)
* Bring the services up by running:

    ```bash
    docker compose up -d
    ```

* Publish the PostGIS layers to GeoServer either using the rest api or the GUI.

**Note:** If you have a database dump of the previous running instance of the platform
and GeoServer data directory. You need to add your database dumps into `data`
folder and also do a dump and restore for GeoServer using the
`GeoServer backup and restore plugin`.

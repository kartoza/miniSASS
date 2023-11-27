# Setting up a Local Development Environment

## Prerequisites

- Any Linux distribution for the operating system
- Docker installed on the local machine
- Visual Studio Code for the editor (or any preferred)

## Installation Steps

1. Open the terminal.

2. Create a directory:

    ```bash
    mkdir name_of_directory
    ```

3. Clone the minisass repository:

    ```bash
    git clone https://github.com/kartoza/miniSASS.git
    ```

4. Once cloned, navigate into the repo directory:

    ```bash
    cd miniSASS
    ```

5. Open the directory with VSCode (assuming you have VSCode installed) or open the repository directory in any editor of your choice.

6. Locate the `template.env` file and rename it to `.env`.

7. Adjust the following variables in the `.env` file:

    ```env
    HTTPS_HOST=${COMPUTER_HOSTNAME}
    ```

    Replace `COMPUTER_HOSTNAME` with the actual name of the host (type `hostname` in the terminal to get it and assign it to the `HTTPS_HOST` variable).

8. Optional: You might need to adjust the build context of the S3 mount.
    In case it fails to build, 
    replace lines 32-36 in 
    `docker-compose.yml` file with the following:

    ```yaml
    mount:
      image: kartoza/s3mount
      build:
        context: .
        dockerfile: ./deployment/docker-s3-bucket/Dockerfile
    ```

9. After these changes, you're ready to build the container. Type:

    ```bash
    docker compose build
    ```

10. Upon successful completion, type:

    ```bash
    docker compose up -d db;sleep 180;docker compose up -d
    ```

11. This will start the containers, and you should be able to access the web application from https://${COMPUTER_HOSTNAME}/.

## Local Development (Backend)

- The local database will be empty; fixture files need to be manually loaded for some test data.

### Useful Commands on the Backend Container

- Creating a superuser:

    ```bash
    docker exec -it name_of_django_container python manage.py createsuperuser
    ```

- Accessing the container:

    ```bash
    docker exec -it name_of_django_container bash
    ```

- To reflect saved changes (for the backend only):

    ```bash
    docker restart name_of_django_container
    ```

- To stop all running containers:

    ```bash
    docker down -v
    ```

## Frontend Development

- The frontend uses React + TypeScript + Tailwind CSS.

- To locally work on the frontend:

1. Navigate into the frontend directory:

    ```bash
    cd minisass_frontend
    ```

2. Type:

    ```bash
    npm install
    ```

    Ensure you have Node.js version 16 and upwards installed on your system. If you are using an older Node version, use:

    ```bash
    npm install --legacy-peer-deps
    ```

    (not recommended)

3. After a successful `npm install`, type:

    ```bash
    npm run start
    ```

    This will expose a URL to access in the web browser. Making changes and saving them will automatically trigger the browser to refresh. In development mode, static files will not be available since they're being served from the Django container.

4. Alternatively, if you prefer, you can:

    ```bash
    npm run build
    ```

5. Execute the `collectstatic` command on the Django container.
6. Execute the restart command on the Django container, and access the web app from the local URL https://${COMPUTER_HOSTNAME}/

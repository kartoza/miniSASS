# Setting up a Local Development Environment

## Prerequisites

- Any Linux distribution for the operating system.
- Docker installed on the local machine.
- [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04) installed on the local machine.
- Visual Studio Code for the editor (or any preferred editor).

## Installation Steps

1. **Open the terminal.**

2. **Create a directory:**
    ```bash
    mkdir name_of_directory
    ```

3. **Clone the minisass repository:**
    ```bash
    git clone https://github.com/kartoza/miniSASS.git
    ```

4. **Navigate into the repository directory:**
    ```bash
    cd miniSASS
    ```

5. **Open the directory with VSCode (assuming you have VSCode installed) or open the repository directory in any editor of your choice.**

6. **Optional: Adjust the build context of the S3 mount.**
    In case of build failure, replace lines 32-36 in the `docker-compose.yml` file with the following:
    ```yaml
    mount:
      image: kartoza/s3mount
      build:
        context: .
        dockerfile: ./deployment/docker-s3-bucket/Dockerfile
    ```

7. **Build the container:**
    ```bash
    docker compose build
    ```

8. **Start the containers:**
    ```bash
    docker compose up -d db; sleep 180; docker compose up -d
    ```

9. **Access the Django container:**
    ```bash
    docker exec -it name_of_django_container bash
    ```
    - Navigate to minisass frontend folder `cd minisass_frontend`
    - Run `npm install`
    - Run `npm run build`
    - Navigate to the main directory `cd ..`
    - Execute the collect static command: `python manage.py collectstatic --noinput`

10. **Access the web application:**
    Visit 'http://localhost:61122/'

## Local Development (Backend)

- The local database will be empty; fixture files need to be manually loaded for some test data.

### Useful Commands on the Backend Container

- **Creating a superuser:**
    ```bash
    docker exec -it name_of_django_container python manage.py createsuperuser
    ```

- **Accessing the container:**
    ```bash
    docker exec -it name_of_django_container bash
    ```

- **To reflect saved changes (for the backend only):**
    ```bash
    docker restart name_of_django_container
    ```

- **To stop all running containers:**
    ```bash
    docker compose down -v
    ```

## Frontend Development outside the Container

- The frontend uses React + TypeScript + Tailwind CSS.

- **To locally work on the frontend:**

1. **Navigate into the frontend directory:**
    ```bash
    cd minisass_frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```
    - Ensure you have Node.js version 16 and upwards installed on your system. If you are using an older Node version, use:
    ```bash
    npm install --legacy-peer-deps
    ```
    (not recommended)

3. **Start the development server:**
    ```bash
    npm run start
    ```
    - This will expose a URL to access in the web browser. Making changes and saving them will automatically trigger the browser to refresh. In development mode, static files will not be available since they're being served from the Django container.

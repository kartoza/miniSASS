---
title: miniSASS
summary: The mini stream assessment scoring system (miniSASS) is a simple and accessible citizen science tool for monitoring the water quality and health of stream and river systems. You collect a sample of aquatic macroinvertebrates (small, but large enough to see animals with no internal skeletons) from a site in a stream or river. The community of these aquatic macroinvertebrates present then tells you about the water quality and health of the stream or river based on the concept that different groups of aquatic macroinvertebrates have different tolerances and sensitivities to disturbance and pollution.
    - Jeremy Prior
    - Ketan Bamniya
date: 27-11-2023
some_url: https://minisass.sta.do.kartoza.com/
copyright: Copyright 2023, miniSASS
contact:
license: This program is free software; you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
---

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

9. **Access the web application:**
    Visit 'http://localhost:61122/'

## Troubleshooting

### Empty Page

This is likely to be caused by static files, follow these steps:

1. **Access the Django container:**
    ```bash
    docker exec -it name_of_django_container bash
    ```
2. **Navigate to the frontend directory:**
    ```bash
    cd minisass_frontend
    ```
3. **Install dependencies:**
    ```bash
    npm install
    ```
4. **Build the frontend:**
    ```bash
    npm run build
    ```
5. **Navigate to the main directory:**
    ```bash
    cd ..
    ```
6. **Execute the collect static command:**
    ```bash
    python manage.py collectstatic --noinput
    ```

### Other Issues

If you encounter any other issues, consider checking the logs, inspecting containers, and reviewing Docker Compose configurations.
```bash
docker compose logs
docker compose ps
docker compose config

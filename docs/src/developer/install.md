---
title: miniSASS
summary: The mini stream assessment scoring system (miniSASS) is a simple and accessible citizen science tool for monitoring the water quality and health of stream and river systems. You collect a sample of aquatic macroinvertebrates (small, but large enough to see animals with no internal skeletons) from a site in a stream or river. The community of these aquatic macroinvertebrates present then tells you about the water quality and health of the stream or river based on the concept that different groups of aquatic macroinvertebrates have different tolerances and sensitivities to disturbance and pollution.
    - Jeremy Prior
    - Ketan Bamniya
date: 27-11-2023
some_url: https://minisass.org/
copyright: Copyright 2023, miniSASS
contact: nicholas@groundtruth.co.za, info@minisass.org
license: This program is free software; you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
---

# Setting up a Local Development Environment

## What you are running

The stack is four containers:

| Service | Role |
| ------- | ---- |
| `db` | PostGIS 16, holds sites, observations and the `admin_countries` layer |
| `django` | Django 4.2 under uwsgi, plus the built React frontend |
| `tiles` | pg_tileserv, publishes observations and sites as vector tiles |
| `web` | nginx, the only service you talk to directly (port 61122) |

`django` speaks the uwsgi protocol rather than HTTP, so it cannot be browsed
directly. Always go through nginx.

## Prerequisites

- Docker with Compose v2, so `docker compose` (not `docker-compose`). Linux,
  macOS and Windows with WSL2 are all fine.
- About 8 GB of free disk. The Django image bundles TensorFlow.
- An editor of your choice.

!!! note "Apple Silicon and other arm64 hosts"
    The Django image must be built for `linux/amd64`, which the override template
    below does for you. A native arm64 build fails: `geopandas` depends on
    `fiona`, which publishes no aarch64 wheels, so pip compiles it from source,
    and `deployment/docker/Dockerfile` installs `gcc` without `g++`. Even with
    `g++` present, Debian bullseye only ships GDAL 3.2.2 while current `fiona`
    requires GDAL 3.4 or newer. Emulation is slower to build but matches the
    production runtime exactly.

## Installation steps

1. **Clone the repository.**

    ```bash
    git clone https://github.com/iwmihq/miniSASS.git
    cd miniSASS
    ```

2. **Create your environment file.**

    ```bash
    cp .example.env .env
    ```

    Then edit `.env`. Every variable is documented inline. The ones you must set:

    | Variable | Why |
    | -------- | --- |
    | `POSTGRES_PASS` | database password |
    | `SECRET_KEY` | leaving it blank falls back to a value committed in the repository |
    | `DJANGO_SUPERUSER_USERNAME`, `_EMAIL`, `_PASSWORD` | the admin account; creation is skipped if any is blank |
    | `MINIO_*` / `AWS_*` | object storage for photos and the classifier model |

3. **Create the compose override.**

    ```bash
    cp docker-compose.override.template.yml docker-compose.override.yml
    ```

    This step is easy to miss and nothing works without it. The `Makefile` sets
    `COMPOSE_FILE=docker-compose.yml:docker-compose.override.yml`, so every make
    target fails until the file exists. The override also supplies the
    development nginx configuration and the `linux/amd64` platform.

4. **Build the images.**

    ```bash
    docker compose build
    ```

5. **Start the stack.**

    ```bash
    docker compose up -d
    ```

    No manual wait is needed: `db` has a healthcheck and `django` depends on it.
    The first start also runs `npm install && npm run build` because
    `DEV_SETUP=TRUE`, which takes a few minutes.

6. **Open the application** at <http://localhost:61122/>.

7. **Speed up later restarts.** Once
   `django_project/minisass_frontend/src/dist` exists, set `DEV_SETUP=FALSE` in
   `.env` and `docker compose up -d django`.

## Frontend development

Two mutually exclusive modes, both driven by `DEBUG`:

- `DEBUG=False` serves the built bundle from `/static/`. Use this for backend
  work and for anything resembling production.
- `DEBUG=True` makes the page load the Vite dev server instead, giving hot module
  reloading. The page stays blank until you also start Vite:

    ```bash
    make frontend-dev
    ```

Forgetting the second half of that is the usual cause of an apparently empty page.

## Vector tiles

pg_tileserv publishes `public.minisass_observations`, `public.sites` and
`public.admin_countries`. Check what is available:

```bash
curl http://localhost:61122/tiles/index.json
```

The MapLibre style is served by this deployment from
`django_project/webmapping/styles/`, collected to
`/static/webmapping/minisass_style_v1.json`. Edit the file in the repository and
re-run `collectstatic` to change the map's appearance.

## Image classifier

Observation photos are classified into macroinvertebrate groups by a Keras model
held in object storage at `<MINIO_BUCKET>/ai_image_calculation.h5`. It loads on
first use, so warm it rather than making a user's upload wait:

```bash
docker compose exec django python manage.py warm_ai_model
```

If the model cannot be fetched, classification is skipped and observations still
save normally.

## Troubleshooting

### Blank page

Almost always one of:

1. `DEBUG=True` without the Vite dev server running. Either set `DEBUG=False` or
   run `make frontend-dev`.
2. The frontend was never built. Set `DEV_SETUP=TRUE` and restart `django`, or
   build it by hand:

    ```bash
    docker compose exec django bash -c "cd minisass_frontend && npm install --legacy-peer-deps && npm run build"
    docker compose exec django python manage.py collectstatic --noinput
    ```

### Site loads but the map is empty

Check that the tile service is reachable and returning data:

```bash
curl -I http://localhost:61122/tiles/public.minisass_observations/0/0/0.pbf
```

An empty database produces valid but empty tiles, which is expected.

### Images are missing

Photo URLs are rendered as `/minio-media/<key>`. nginx serves that path, either
from local MinIO or by proxying your S3 bucket. A 403 from S3 usually means the
object does not exist, because anonymous requests without `s3:ListBucket`
permission get `AccessDenied` rather than `404`.

### Other issues

```bash
docker compose logs django   # application and entrypoint output
docker compose ps            # container health
docker compose config        # the merged configuration actually in use
```

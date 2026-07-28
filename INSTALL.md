Installing miniSASS
===================

miniSASS is a Django application served by uwsgi behind nginx, with PostGIS for
storage, pg_tileserv for vector tiles, and a Vite/React single-page frontend.
Object storage (observation photos, certificates, the image-classifier model) is
either a local MinIO container or an S3 bucket.

A more detailed walkthrough, including troubleshooting, lives in
[docs/src/developer/install.md](docs/src/developer/install.md) and on the
[published documentation site](https://iwmihq.github.io/miniSASS/).

# Requirements

* Docker with Compose v2 (`docker compose`, not `docker-compose`).
* Roughly 8 GB of free disk. The Django image is large because it bundles
  TensorFlow.
* On Apple Silicon or another arm64 host, the Django image must be built for
  `linux/amd64`. The provided override template does this for you; see the note
  in `docker-compose.override.template.yml` for why a native arm64 build fails.

# Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/iwmihq/miniSASS.git
    cd miniSASS
    ```

2. Create your environment file and edit the placeholder values:

    ```bash
    cp .example.env .env
    ```

    At a minimum set `POSTGRES_PASS`, `SECRET_KEY`, the `DJANGO_SUPERUSER_*`
    values and the object-storage credentials. Every setting is documented inline.

3. Create the compose override. The `Makefile` sets
   `COMPOSE_FILE=docker-compose.yml:docker-compose.override.yml`, so make targets
   fail until this exists:

    ```bash
    cp docker-compose.override.template.yml docker-compose.override.yml
    ```

4. Build the images:

    ```bash
    docker compose build
    ```

5. Start the stack:

    ```bash
    docker compose up -d
    ```

    The database container has a healthcheck and Django waits on it, so no manual
    sleep is required. The first start also builds the frontend (because
    `DEV_SETUP=TRUE`), which takes a few minutes.

6. Open <http://localhost:61122/>.

Once `django_project/minisass_frontend/src/dist` exists, set `DEV_SETUP=FALSE` in
`.env` for much faster restarts.

# Loading data

A new database starts empty apart from the reference fixtures loaded by the
entrypoint. To work against a copy of an existing deployment, restore a dump into
the local database, for example:

```bash
pg_dump -h <source-host> -U <user> -d <database> \
    --format=custom --no-owner --no-privileges --file=minisass.dump

docker compose exec -T db psql -U "${POSTGRES_USER}" -d postgres \
    -c "DROP DATABASE IF EXISTS minisass;" -c "CREATE DATABASE minisass;"
docker compose exec -T db pg_restore -U "${POSTGRES_USER}" -d minisass \
    --no-owner --no-privileges < minisass.dump
```

Errors about existing PostGIS functions or an existing `topology` schema during
restore are expected and harmless.

# Optional: image classifier

Observation photos are classified into macroinvertebrate groups by a Keras model
stored in object storage as `<MINIO_BUCKET>/ai_image_calculation.h5`. It is
downloaded and loaded on first use. Because it is large, warm it explicitly rather
than making the first upload wait:

```bash
docker compose exec django python manage.py warm_ai_model
```

If the model is absent, classification is skipped and observations still save
normally.

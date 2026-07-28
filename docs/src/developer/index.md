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

# Developer Documentation

Everything you need to run miniSASS locally and work against its API.

## Start here

| Guide | What it covers |
| ----- | -------------- |
| **[Installation](./install.md)** | Getting the stack running on your machine |
| **[Authentication](./authentication.md)** | Registering, logging in, and JWT tokens |
| **[Sites](./sites.md)** | Creating and reading monitoring sites |
| **[Observations](./observations.md)** | Submitting and reading observations |
| **[Profile](./profile.md)** | User profile and expert certificates |
| **[Third-party API](./3rd-party-api-access.md)** | Bulk access to observation data |

## Base URL

Production is `https://minisass.org`. A local stack from the
[installation guide](./install.md) runs on `http://localhost:61122`. Every path
below is relative to whichever you are using.

## Endpoint reference

Verified against the running application. Endpoints marked **Auth** require a
JWT `Authorization: Bearer <access token>` header.

### Authentication

| Method | Path | Auth | Purpose |
| ------ | ---- | :--: | ------- |
| POST | `/authentication/api/register/` | | Create an account |
| POST | `/authentication/api/login/` | | Log in with email and password |
| POST | `/authentication/api/token/` | | Obtain a JWT access and refresh pair |
| POST | `/authentication/api/token/refresh/` | | Exchange a refresh token for a new access token |
| GET | `/authentication/api/check-auth-status/` | Auth | Current user and login state |
| POST | `/authentication/api/logout/` | Auth | Log out |
| GET | `/authentication/api/check-registration-status/<email>/` | | Whether an account is activated |
| GET | `/authentication/api/activate/<uidb64>/<token>/` | | Activation link target |
| POST | `/authentication/api/request-reset/` | | Send a password reset email |
| POST | `/authentication/api/update-password-reset/<uid>/<token>/` | | Set a new password |
| POST | `/authentication/api/contact-us` | | Submit a support request |

### Sites

| Method | Path | Auth | Purpose |
| ------ | ---- | :--: | ------- |
| GET | `/monitor/sites/` | | List sites |
| POST | `/monitor/sites/` | Auth | Create a site |
| GET | `/monitor/sites/<id>/` | | Retrieve a site |
| PUT / PATCH | `/monitor/sites/<id>/` | Auth | Update a site |
| DELETE | `/monitor/sites/<id>/` | Auth | Delete a site |
| POST | `/monitor/sites/<id>/save-images/` | Auth | Attach images to a site |
| GET | `/monitor/sites/count/` | | Total number of sites |
| GET | `/monitor/sites/is-land/<lat>/<long>/` | | Check a coordinate is not in the ocean |
| GET | `/monitor/site-observations/<lat>/<long>/` | | Observations near a coordinate |

### Observations

| Method | Path | Auth | Purpose |
| ------ | ---- | :--: | ------- |
| GET | `/monitor/observations/` | Auth | List observations |
| POST | `/monitor/observations/` | Auth | Create an observation |
| GET | `/monitor/observations/<id>/` | Auth | Retrieve an observation |
| PUT / PATCH | `/monitor/observations/<id>/` | Auth | Update an observation |
| DELETE | `/monitor/observations/<id>/` | Auth | Delete an observation |
| GET | `/monitor/observations/observation-details/<id>/` | | Read-only observation detail |
| GET | `/monitor/observations/recent-observations/` | | Most recent observations |
| GET | `/monitor/observations/count/` | | Total number of observations |
| GET | `/monitor/observations/by-site/<site_id>/` | | Observations for one site |
| POST | `/monitor/upload-pest-images/` | Auth | Upload macroinvertebrate photos |
| POST | `/monitor/observations/<id>/save-images/` | Auth | Attach images to an observation |
| GET | `/monitor/observations/<observation_id>/images/` | | List an observation's images |
| GET | `/monitor/observations/download-v2/<site_id>/` | | Download observations for a site |

!!! warning "Two similar observation paths"
    `/monitor/observations/observation-details/<id>/` is **read-only**. Updates and
    deletes go to `/monitor/observations/<id>/`. Sending a `PUT` or `DELETE` to the
    `observation-details` path returns `405 Method Not Allowed`.

### Third-party data access

| Method | Path | Auth | Purpose |
| ------ | ---- | :--: | ------- |
| GET | `/monitor/sites-with-observations/` | Auth | All sites with their observations |
| GET | `/monitor/sites-with-observations/?start_date=YYYY-MM-DD` | Auth | Filter from a date |

See the [third-party API guide](./3rd-party-api-access.md) for how to request a token.

## Interactive API browser

The application ships Swagger and ReDoc, generated from the code itself, so they
are always current:

- Swagger UI: [`/swagger/`](https://minisass.org/swagger/)
- ReDoc: [`/redoc/`](https://minisass.org/redoc/)
- Raw schema: `/swagger.json`

Locally these are at `http://localhost:61122/swagger/` and `/redoc/`.

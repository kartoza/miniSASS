---
title: miniSASS
summary: The mini stream assessment scoring system (miniSASS) is a simple and accessible citizen science tool for monitoring the water quality and health of stream and river systems. You collect a sample of aquatic macroinvertebrates (small, but large enough to see animals with no internal skeletons) from a site in a stream or river. The community of these aquatic macroinvertebrates present then tells you about the water quality and health of the stream or river based on the concept that different groups of aquatic macroinvertebrates have different tolerances and sensitivities to disturbance and pollution.
    - Jeremy Prior
    - Ketan Bamniya
date: 27-11-2023
some_url: https://minisass.org/
copyright: Copyright 2023, miniSASS
contact:
license: This program is free software; you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
---

# Profile API

## Description

The User Profile API functions as an endpoint to update the user profile, password, and certificate.

## How to use

### current_domain: https://minisass.sta.do.kartoza.com/

### 1. https://{current_domain}/authentication/api/user/update/

This API only allows 2 methods:
1. GET
2. POST

#### GET
Used to get the User Profile detail. No parameter is needed, since the endpoint automatically gets the 
profile based on the authenticated user. A success request will have the status code 200.

Example response:
```typescript
{
    "username": "admin",
    "email": "admin@kartoza.com",
    "name": "Admin",
    "surname": "Name",
    "organisation_type": "Other",
    "organisation_name": "Kartoza",
    "country": "ZA",
    "is_expert": true
}
```

#### POST
Used to update the User Profile detail. The accepted content type is application/json.

Here is a payload example to send the POST request.
```typescript
{
    "username": "admin",
    "email": "admin@kartoza.com",
    "name": "Admin",
    "surname": "Name",
    "organisation_type": "Other",
    "organisation_name": "Kartoza",
    "country": "ZA"
}
```
The POST request will return serialized user profile, just like the one returned by GET request.
```typescript
{
    "username": "admin",
    "email": "admin@kartoza.com",
    "name": "Admin",
    "surname": "Name",
    "organisation_type": "Other",
    "organisation_name": "Kartoza",
    "country": "ZA",
    "is_expert": true
}
```

### 3. https://{current_domain}/authentication/api/user/certificate/upload/

This API only allows 2 methods:
1. GET
2. POST

#### GET
Used to get the User certificate detail. No parameter is needed, since the endpoint automatically gets the 
certificate based on the authenticated user. A success request will have the status code 200.

Example response:
```typescript
{
    "certificate": "/minio-media/demo/6/certificate.png"
}
```

#### POST
Used to upload the certificate. The accepted content type is multipart/form-data.

The Form Data consists of 1 entry: `certificate`.

`certificate`: The uploaded certificate file. The value is taken from file input.

If uploading certificate is successful, a response 200 will be returned with the 
uploaded certificate URL.
```typescript
{
    "certificate": "/minio-media/demo/6/certificate.png"
}
```

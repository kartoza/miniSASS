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

# Profile API

## Description

User Profile API functions as an endpoint to update user profile, password, and certificate.

## How to use

### current_domain: https://minisass.sta.do.kartoza.com/

### 1. https://{current_domain}/authentication/api/user/update/

This API only allows 2 methods:
1. GET
2. POST

#### GET
Used to get User Profile detail including the uploaded certificate. No parameter is needed, since the endpoint automatically get the 
profile based on the authenticated user. Success request will have status code 200.
When using GET, `old_password`, `password`, and `confirm_password` field will always be empty.

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
    "old_password": "",
    "password": "",
    "confirm_password": "",
    "certificate": "/minio-media/demo/6/certificate.png",
}
```

#### POST
Used to update User Profile detail, including certificate upload. 
The accepted content type are multipart/form-data.

Here is an example to send the POST request.
```typescript
const URL = 'https://minisass.sta.do.kartoza.com/authentication/api/user/update/'l
const response = await axios.post(URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
});
```

The Form Data consists of 2 entries: `certificate` and `data`.

`certificate`: The uploaded certificate file. The value is taken from file input.

`data`: The JSON string representation of updated user profile.
If the original data is this:
```typescript
{
    "username": "admin",
    "name": "Admin",
    "surname": "Name",
    "email": "admin@kartoza.com",
    "country": "ZA",
    "password": "",
    "confirmPassword": "",
    "oldPassword": "",
    "updatePassword": false,
    "organisation_name": "Kartoza",
    "organisation_type": "Other",
}
```
Then it will be sent as this
```typescript
'{"username": "admin", "name": "Admin", "surname": "Name", "email": "admin@kartoza.com", "country": "ZA", "password": "", "confirmPassword": "", "oldPassword": "", "updatePassword":false, "organisation_name": "Kartoza", "organisation_type": "Other"}'
```


If updating profile/changing password/uploading certificate is successful, response 200 will be returned
with User Profile detail.
```typescript
{
    "username": "admin",
    "email": "admin@kartoza.com",
    "name": "Admin",
    "surname": "Name",
    "organisation_type": "Other",
    "organisation_name": "Kartoza",
    "country": "ZA",
    "old_password": "",
    "password": "",
    "confirm_password": "",
    "certificate": "/minio-media/demo/6/certificate.png",
}
```

####  Update Password
To update password, set `updatePassword` to `true`, then provide value to `old_password`, `password`, 
and `confirm_password`.
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

# Authentication API

## Our system uses the Django Rest Framework Authentication Package

## Description

Uses JSON Web Tokens, which are encoded tokens containing user information.
With every request made, the token will be validated for the logged in user.
The token expires after a certain interval, which means on the frontend there should be a mechanism
to refresh the token for example a function to constantly check and determine if the user is still logged in, if so refresh the token.

## How to use

### current_domain: https://minisass.sta.do.kartoza.com/

### 1. https://{current_domain}/authentication/api/login

![Login Api](./img/login_api.png)

This API is used for logging in a user.
This API only allows 2 methods:

1. POST
2. OPTIONS

 **POST**: used to submit user credentials. The credentials are accepted in the form of:
    i. application/json
    ii. application/x-www-form-urlencoded
    iii. multipart/form-data

    **example usage**:
    {
        "email": "test@gmail.com",
        "password": "test_password",
        "usernameForEmailRetrieval": "test_username"
    }

 **OPTIONS**: Returns the documentation available for the login api (basic description).

**Additional Info**:
    The api is interactive and will usually return an error message provided the credentials
    are invalid for example 401 unauthorized etc.

![Login Api unauthorized](./img/invalid_credentials.png)

**Obtaining a token**:
    All users that are authenticated require a token in order to be able to make
    successful request to the API.

### 2. https://{current_domain}/authentication/api/token/

![Token Api](./img/token_api.png)

    example usage:
    {
        "username": "test_user",
        "password": "test_password"
    }

    This will return an access token as well as a refresh token for the user.

![Token Api Success](./img/success_response_for_token_obtain.png)

**Refreshing the token**:

### 3. https://{current_domain}/authentication/api/refresh/

![Token Refresh Api](./img/token_refresh.png)

    example usage: 
    {
        "refresh": "long_refresh_token_string"
    }

    returns a success response 200 with the access token.

![Token Refresh Success](./img/success_response_token_obtain.png)

**Checking the Authentication status**:

### 4. https://{current_domain}/authentication/api/check-auth-status/

![Check Auth Api](./img/check_auth_status.png)

This API is used to confirm if the user is logged in.

    example usage: 
    A get request to the above url.

    returns a success response 200 with the with an object containing user details e.g. is_authenticated variable.

**Logging out a user**:

### 5. https://{current_domain}/authentication/api/logout/

![Logout API](./img/logout_user_api.png)

This API is used to logout the user against the authentication backend.
Any action from the frontend that triggers the logout of a user should also call this api. This ensures the user is logged out

    example usage: 
    A post request to the above url

**Registering a user**:

### 6. https://{current_domain}/authentication/api/register/

![Register Api](./img/registration_api.png)

This API is used for registering a user.
This API only allows 2 methods

1. POST
2. OPTIONS

**POST**: used to submit user details. The details are accepted in the form of:
    i. application/json
    ii. application/x-www-form-urlencoded
    iii. multipart/form-data

    example usage: 
    {
        "username": "test_user",
        "first_name": "test_name",
        "last_name": "test_lastname",
        "email": "test@kartoza.com",
        "password": "test_password",
        "organizationType": "NGO",
        "organizationName": "test",
        "country": "South Africa",
        "additional_fields": "additional_data"
    }

    returns success response 201 created.

**Additional data** for the user is saved on their User Profile:
    Currently, fields required:
    i.organisation_type
    ii.organisation_name
    iii.country
    These fields are mandatory on registration or a 400 bad request error is returned.

**Additional Info**:
    This API is also interactive, returns errors for example
    400 bad request ie `enter a valid email`.

![Register Api Errors](./img/registration_errors.png)

**Requesting Password Reset**:

### 5. https://{current_domain}/authentication/api/request-reset

![Register Api](./img/request_password_reset.png)

    This API enables the user to reset their forgotten password from the frontend.

    example usage: 
    {
        "email": "users_email"
    }

    returns a success message and a 200 ok.

**Additional Info**:
    The user will receive an email with the instructions on how to reset their forgotten password.

### Summary

The `Authentication API, is responsible for login, registration and password reset.

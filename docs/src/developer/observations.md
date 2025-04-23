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

# Observations and Images API Documentation

The Observations API facilitates users in creating observations for various sites, allowing the specification of existing site IDs or the creation of new sites if they are not available. Additionally, it enables retrieval of recent observations, access to all observations, fetching a single observation, and other CRUD (Create, Retrieve, Update, Delete) operations.

## current_domain: https://minisass.sta.do.kartoza.com/

## Endpoints

1. **CREATE** `https://{current_domain}/monitor/observations/`

- **Request Type**: POST
- **Authentication**: User authentication required (Login)
- **CSRF Protection**: Exempted
- **Content Type**: Application/JSON

### Request Payload


The API expects a JSON payload containing the following fields:

- `create_site_or_observation`: variable containing true or false value on whether to create a new site and attach an observation to it or use an existing one.
- `siteId`: integer value provided create_site_or_observation is false.
- `image_0`: these can be added from _0 to _10 or more. This is for attaching site images which will be retrieved from the request object.
- `user_id`: variable containing user id if not authenticated.
- `data`: object containing all the data below.
    - `snails`: true or false value if the user selected a snail.
    - `caddisflies`: true or false value if the user selected a caddisflies.
    - `damselflies`: true or false value if the user selected a damselflies.
    - `dragonflies`: true or false value if the user selected a dragonflies.
    - `leeches`: true or false value if the user selected a leeches.
    - `minnow_mayflies`: true or false value if the user selected a minnow_mayflies.
    - `other_mayflies`: true or false value if the user selected a other_mayflies.
    - `stoneflies`: true or false value if the user selected a stoneflies.
    - `trueflies`: true or false value if the user selected a true_flies.
    - `worms`: true or false value if the user selected a worms.
    - `flat_worms`: true or false value if the user selected a flat_worms.
    - `bugs_beetles`: true or false value if the user selected a bugs_beetles.
    - `score`: Decimal value representing the observation score.
    - `datainput`: Object containing observation data.
        - `notes`: Comments or notes regarding the observation.
        - `waterclaritycm`: Decimal value representing water clarity.
        - `watertemperatureOne`: Decimal value representing water temperature.
        - `ph`: Decimal value representing pH.
        - `dissolvedoxygenOne`: Decimal value representing dissolved oxygen.
        - `dissolvedoxygenOneUnit`: Unit for dissolved oxygen (default: 'mgl').
        - `electricalconduOne`: Decimal value representing electrical conductivity.
        - `electricalconduOneUnit`: Unit for electrical conductivity (default: 'mS/m').
        - `selectedSite`: ID of an existing site or 0 if a new site is to be created.
        - `siteName`: (Optional) Name of the new site.
        - `riverName`: (Optional) Name of the river for the new site.
        - `siteDescription`: (Optional) Description of the new site.
        - `rivercategory`: (Optional) River category for the new site.
        - `longitude`: (Optional) Longitude for the new site's location.
        - `latitude`: (Optional) Latitude for the new site's location.
        - `date`: Observation date. The date should be a current date or before. No future dates allowed.
        - `ml_score`: machine learning score of the observation.
        - `flag`: clean or dirty value. determines the color of the appearance of the crab on the map.
        - `selectedSite`: option field used as a fallback if siteId has no value.


### Response

- **Success Response**: 
    - Status Code: 200 OK
    - JSON Response:
        ```json
        {
            "status": "success",
            "observation_id": observation_id
        }
        ```
        - `observation_id`: ID of the created observation.

- **Error Response**:
    - Status Code: 500 Internal Server Error
    - JSON Response:
        ```json
        {
            "status": "error",
            "message": "Error message details..."
        }
        ```
        - `message`: Details of the encountered error.

- Invalid longitude or latitude format: invalid format for location values.
- Invalid longitude or latitude values: invalid location values provided for e.g values that do not fall within range.
- HTTP_404_NOT_FOUND when the user is not authenticated and the provided user id cannot be matched to an existing user.
- Site name already exists: site name values need to be unique or this error response is returned.
- cannot find site to save observation to: when supplied siteId cannot be matched to an existing site.
- Invalid request method: happens when the request method is not allowed on the endpoint e.g using a get instead of post.

### Steps to Use

1. **Provide Payload Data**: To create observations, you'll need to send a POST request to the `/create-observations/` endpoint with the required payload. 
2. **Payload Structure**: Include observation data within the `data` object. Specify site ID for existing sites or create a new site by adding its details and setting `create_site_or_observation` to true.
3. **Understanding GeoLocation**: For new sites, use `longitude` and `latitude` for the site's location. Note SRID is set to 4326.
4. **Checkboxes**: Use boolean values (True/False) for checkboxes indicating checked groups.
5. **Observation Creation**: Upon success, the API returns the observation ID in the response.
6. **Error Handling**: In case of errors, the API responds with an error message for troubleshooting.

### Below is an example of the object structure to be included in the request:

```javascript
const observationsData = {
  create_site_or_observation: false,
  siteId: 1,
  user_id: 1, // when user is not authenticated
  // site images
  image_0: (binary),
  image_1: (binary),
  data: {
    score: 5.846153846153846,
    flatworms: true,
    leeches: false,
    crabs_shrimps: true,
    stoneflies: false,
    minnow_mayflies: false,
    other_mayflies: false,
    damselflies: false,
    dragonflies: false,
    bugs_beetles: false,
    true_flies: false,
    caddisflies: false,
    snails: false,
    datainput: {
        // Data input for the observation
        notes: "Comments or notes regarding the observation",
        waterclaritycm: 8.2,
        watertemperatureOne: 25.3,
        ph: 7.0,
        dissolvedoxygenOne: 9.1,
        dissolvedoxygenOneUnit: "mgl",
        electricalconduOne: 15.7,
        electricalconduOneUnit: "mS/m",
        selectedSite: 0, // ID of an existing site or 0 if creating a new site
        ml_score: 5, // usually sent from mobile app 
        flag: clean,

        // If creating a new site, include the following:
        siteName: "New Site Name",
        riverName: "New River",
        siteDescription: "Description of the new site",
        rivercategory: "Rocky",
        longitude: 24.84165,
        latitude: -30.47829,
        date: "2023-12-01" // Observation date should be current date or before
    }
  }
};

axios.post(`${current_domain}/monitor/observations/`, observationsData);
```

2. **GET RECENT OBSERVATIONS** `https://{current_domain}/monitor/observations/recent-observations/`

![recent observation api](./img/recent_observations.png)

- **Request Type**: GET
- **Authentication**: None required
- **CSRF Protection**: Not applicable
- **Content Type**: Not applicable

### Response

The response contains a list of recent observations, limited to a maximum of 20, ordered by their timestamp.

#### Response Structure

Each observation object in the response includes the following fields:
- `observation`: ID of the observation
- `site`: Name of the site associated with the observation
- `username`: Username of the user who submitted the observation
- `organisation`: Organization name (if available) associated with the user
- `time_stamp`: Timestamp of the observation
- `score`: Score assigned to the observation

#### Example Response

```json
[
  {
    "observation": 123,
    "site": "Site Name",
    "username": "User123",
    "organisation": "Organization Name",
    "time_stamp": "2023-12-01T13:41:45.930873+02:00",
    "score": 5.5
  },
  {
    "observation": 124,
    "site": "Another Site",
    "username": "User456",
    "organisation": "",
    "time_stamp": "2023-11-30T09:15:30.123456+02:00",
    "score": 6.8
  },
]
```

3. **GET OBSERVATION DETAILS** `https://{current_domain}/monitor/observations/observation-details/<observation_id>/`

![observation details api](./img/observation_details.png)

This API endpoint retrieves a specific observation by its ID.

## Endpoint

`/observations/<observation_id>/`

- **Request Type**: GET
- **Authentication**: Not required
- **CSRF Protection**: Not applicable
- **Content Type**: Not applicable

### Response

The response contains details of the requested observation.

#### Response Structure

The response includes various details related to the observation:

- `observation`: ID of the observation
- `site`: Site details associated with the observation, including:
  - `sitename`: Name of the site
  - `rivername`: Name of the river for the site
  - `sitedescription`: Description of the site
  - `rivercategory`: Category of the river for the site
  - `longitude`: Longitude of the site's location
  - `latitude`: Latitude of the site's location
- `collectorsname`: Name of the user who collected the observation
- `organisationtype`: Organization type associated with the user (if available)

#### Example Response

```json
{
  "observation": 123,
  "site": {
    "sitename": "Sample Site",
    "rivername": "Sample River",
    "sitedescription": "Description of the site",
    "rivercategory": "Rocky",
    "longitude": 24.84165,
    "latitude": -30.47829
  },
  "collectorsname": "John Doe",
  "organisationtype": {
    "id": 1,
    "description": "NGO"
  }
}
```

4. **Observation Update, and Deletion** `https://{current_domain}/monitor/observations/observation-details/<observation_id>/`

![crud on observations](./img/crud_observations.png)

This API endpoint allows retrieving, updating, or deleting a specific observation by its ID.

## Endpoint

`/observations/<observation_id>/`

- **Request Type**: GET (Retrieve), PUT (Update), DELETE (Delete)
- **Authentication**: Required (User authentication)
- **CSRF Protection**: Not applicable
- **Content Type**: Application/JSON

### Retrieve Observation

#### Request Type: GET

- **Authentication**: Required
- **Permission**: Read permission required
- **Response**: Details of the requested observation

### Update Observation

#### Request Type: PUT

- **Authentication**: Required
- **Permission**: Write permission required
- **Request Payload**: JSON object with updated observation data
- **Response**: Updated observation details

```json
{
  "score": 8.0,
  "waterclaritycm": 9.2,
  "notes": "Updated notes for the observation",
  // Other fields to update
}
```

### Delete Observation

#### Request Type: DELETE

- **Authentication**: Required
- **Permission**: Delete permission required
- **Response**: Confirmation of successful deletion



## Images use the same API for observations 


### 1. **uploading observation images**

#### Request Type: POST

#### endpoint: `/monitor/upload-pest-images/`

### Example payload

```json
{
  "user_id": 1, // if the user is not authenticated but exists in the db
  "pest_0:10": (binary),
  "observationId": 0,
  "siteId": "1"
}
```

### Additional Information

1. **pest_0:10** Represents a pest image. If uploading multiple pest images, it would be `pest_0`, `pest_1`, etc.
-  ":10" is the id of the group to which the pest should be uploaded to.
- ``` grouping ids 
    bugs or beetles: 10 (staging), 23 (production)
    Caddisflies: 11 (staging), 24 (production)
    crabs or shrimps: 4 (staging), 17 (production)
    Damselflies: 8 (staging), 21 (production)
    Dragonflies: 9 (staging), 22 (production)
    Flatworms: 3 (staging), 14 (production)
    Leeches: 1 (staging), 16 (production)
    Minnow Mayflies: 6 (staging), 19 (production)
    Other Mayflies: 7 (staging), 20 (production)
    snails: 13 (staging), 26 (production)
    Stoneflies: 5 (staging), 18 (production)
    True Flies: 12 (staging), 25 (production)
    Worms: 2 (staging), 15 (production)
    ```
2. observationId: the id of the observation to which the images should be saved to. A value of 0 will cause a new observation to be created.
3. siteId: the id of the site to which the observation belongs or should be attached to.
4. A siteId of 0 will cause a new site to be created. In that regard it is also optional to provide site information for e.g.
```json
    {
        "user_id": 1, // if the user is not authenticated
        "pest_0:10": (binary),
        "observationId": 0,
        "siteId": "1",
        "siteName": "test_site21", //keep the names unique
        "riverName": "test_river",
        "siteDescription": "test_description",
        "rivercategory": "rocky",
        "latitude": 0,
        "longitude": 0
    }
```
5. This endpoint also calculates the AI score of the uploaded pest image. The AI score at the time of documentation is 73% accurate.

### Success response returns:
{
	'status': 'success',
	'observation_id': observation.gid,
	'site_id': site.gid,
	'pest_image_id': pest_image.id,
	'classification_results': classification_results 
}

### Error responses: 
- This API returns detailed responses indicating the cause of failure.

### Optional endpoint for uploading images

#### Endpoint: `/monitor/observations/<int:observationId>/save-images/`

#### Request Type: Post Method

#### accepted formats: MultiPart, Form, JSON

- Example payload
```json
"observationdId": 1, //the id of the observation to which the images will be attached
"pest_0:10": (binary) // selected image file
```


### 2. Retrieving Observations with images

![observation images](./img/fetching_images_for_observation.png)

- The response returned from the API will contain an `images` field that will have the observation images.
- each image is an object containing 
```
the id of the image
the pest_id
the pest_name
the image path
```

### 3. Deleting an observation Image

- When deleting an image, make a DELETE request, supplying the following:
  - Observation ID
  - Pest Image ID to delete

### Example URL:
- https://{current_domain}/monitor/observations/observation-details/1/image/1/

### Endpoint:

- `/observations/observation-details/{observation_pk}/image/pest_image_id/`

#### Request Type: DELETE

- **Authentication**: Required
- **Permission**: creator of observation
- **Response**: Confirmation of successful deletion


### 4. Fetching Site Images

- Consume the same API endpoint for sites and the returned object contains the images on that site:

![site images](./img/site_images.png)

### Additional Information

1. **images** Images is an array type containing the images for that particular site.





## Response Types

### HTTP 401 Unauthorized
The request lacks valid authentication credentials or the authentication has failed.

### HTTP 403 Forbidden
The request lacks valid permissions to perform the action they intend.

### HTTP 200 OK
The request has succeeded. The information returned with the response is dependent on the specific view or action performed.

### HTTP 201 Created
The request has been fulfilled, resulting in the creation of a new resource. This indicates a successful creation of an observation.


This API is subject to changes or improvements. Always check for updates.

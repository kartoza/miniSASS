## MiniSASS Image Storage Documentation

This documentation provides an explanation of how images are stored in MiniSASS, making it easy for anyone to understand.

### Overview
Images in MiniSASS are uploaded via the website or mobile app. They are only uploaded when creating a new site or making an observation. The process involves storing the images on Minio, a high-performance object storage system, and saving the path to the images in the MiniSASS database.

### Image Upload Process
#### 1. Image Upload Endpoints
- **New Site Creation**: When creating a new site, users can upload images associated with the site.
- **New Observation**: When making a new observation, users can upload images related to the observation.

#### 2. Handling the Upload
The way images are handled during upload differs depending on the endpoint used (site creation or observation). 

### Storage on Minio
Once an image is uploaded through the MiniSASS platform (either via the website or mobile app), it is stored in our Minio storage system.

#### Steps to Store an Image:
1. **User Upload**: The user uploads an image when creating a new site or making an observation.
2. **Image Transfer**: The image is transferred from the user’s device to the MiniSASS server.
3. **Minio Storage**: The server then stores the image on Minio.
4. **Path Storage**: The path to the uploaded image in Minio is saved in the MiniSASS database. This path is associated with the corresponding site or observation record.

### Database Storage
In the MiniSASS database, the path to the image stored in Minio is saved in the respective record for easy retrieval.

#### Example:
- **Site Record**: 
  - Site ID: 123
  - Site Name: Example Site
  - Image Path: `minio-bucket/sites/123/image.jpg`
  
- **Observation Record**:
  - Observation ID: 456
  - Site ID: 123
  - Observation Notes: Example observation notes
  - Image Path: `minio-bucket/observations/456/image.jpg`

### Summary
- **Image Upload Points**: Images can be uploaded during new site creation or new observations.
- **Storage**: Uploaded images are stored on Minio.
- **Database**: The path to each image in Minio is stored in the corresponding site or observation record in the MiniSASS database.

### Technical Jargon
- **Endpoint**: The specific part of the MiniSASS application where images are uploaded (e.g., site creation or observation creation).
- **Minio**: A high-performance object storage system used to store images.
- **Path**: The location where the image is stored in Minio, which is saved in the database for reference.

This straightforward process ensures that images are securely stored and easily accessible through their respective records in the MiniSASS database.

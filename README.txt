
AutoMarket Backend - Ready for Render
------------------------------------

1) Deploying to Render:
 - Create a new Web Service on Render and point it to this backend folder (or upload zip).
 - Build Command: npm install
 - Start Command: npm start
 - Add Environment Variables in Render dashboard:
    - JWT_SECRET (choose a strong random string)
    - CLOUDINARY_URL (optional) - after creating Cloudinary account (see below)

2) Creating a free Cloudinary account:
 - Go to https://cloudinary.com/users/register/free
 - Fill in details and confirm email.
 - In the Cloudinary dashboard go to 'Settings' -> 'Account Details' -> you will see 'Cloud name', 'API Key' and 'API Secret'.
 - Construct CLOUDINARY_URL like: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 - Paste that into Render Environment variable CLOUDINARY_URL.

3) After deploy:
 - Backend will be available at https://<your-service>.onrender.com
 - Set FRONTEND to call this API (Netlify env variable REACT_APP_BACKEND_URL or edit frontend/app.js BACKEND_URL)

Notes:
 - This is a demo. For production, add authentication endpoints, input validation, rate limiting and secure storage for secrets.

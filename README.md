# Basic Login Page

A simple Express + EJS login project with MongoDB, refreshed with a more polished UI and prepared for cloud deployment.

## What changed

- Modernized the login, signup, and home pages with a shared responsive design
- Moved the database connection to `MONGODB_URI` so secrets are no longer hardcoded in source
- Added `.env.example`, `.gitignore`, static asset support, and a `render.yaml` deploy config

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`.

3. Add your values:

   ```env
   PORT=3000
   JWT_SECRET_KEY=your-strong-secret
   MONGODB_URI=your-mongodb-connection-string
   ```

4. Start the app:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000`

## Deploy on Render

This repo now includes `render.yaml`, which makes Render setup easier.

1. Push this project to GitHub.
2. Create a MongoDB Atlas database if you do not already have one.
3. In Render, create a new `Web Service` from this GitHub repo.
4. Render should detect:
   - Build command: `npm install`
   - Start command: `npm start`
5. Add these environment variables in Render:
   - `JWT_SECRET_KEY`
   - `MONGODB_URI`
   - `PORT` is optional because Render provides one automatically
6. Deploy the service and use the generated Render URL.

## Important security note

Your previous MongoDB connection string was committed directly in `db/db.js`. Even though it has now been removed from the app code, you should still rotate that database password in MongoDB Atlas because it was exposed in the repository history.

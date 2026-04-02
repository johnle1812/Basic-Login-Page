# Basic Login Page

A simple Express + EJS login project with MongoDB.

This repository is both a basic authentication project and a personal testing project for exploring how AI-assisted development works in a real app workflow.

## What I originally built myself

Before using Codex, I built the core app structure myself, including:

- An Express server
- EJS views for login, signup, and home pages
- MongoDB integration with Mongoose
- User registration and login routes
- Password hashing with `bcrypt`
- JWT creation during login

The original version worked as a functional basic login system, but the interface was very minimal and it was not fully prepared for cloud deployment.

## What I used Codex for

I used Codex as a coding assistant to help improve and deploy the project as an experiment in AI-assisted app development.

With Codex, I:

- Redesigned the login, signup, and home pages with a cleaner and more modern UI
- Added shared styling through a `public/styles.css` file
- Updated the app to serve static assets
- Reworked database configuration so the app uses `MONGODB_URI` from environment variables
- Added `.env.example` and `.gitignore`
- Added a `render.yaml` file for easier Render deployment
- Updated the project documentation

## Why this project matters to me

This is a testing project for me to learn:

- how to build and improve an app step by step
- how to use AI tools like Codex as part of the development process
- how to move a local project into an online deployed application

The goal is not just the login page itself, but also understanding how AI can support building, refactoring, and deploying a real project.

Originally, I built this project as a learning lesson for me on how to work with with Node.js, EJS, as well as make an application that works with a database.

## How I used Codex in the deployment process

I used Codex to help me:

- review the project structure
- improve the UI
- identify deployment requirements
- move secrets out of source code
- prepare the app for Render
- troubleshoot deployment issues from logs

This made the repo a practical test case for learning how AI can assist with both coding and deployment tasks.

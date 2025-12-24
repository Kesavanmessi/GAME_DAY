# GAME_DAY

This repository contains a React + Vite frontend and an Express + Node backend using MongoDB (Mongoose). The project provides sports match information, reminders, user accounts, and simple AI features.

## Quickstart (development)

Prerequisites:
- Node.js (18+ recommended)
- MongoDB running locally or accessible via `MONGO_URI`

1) Create env files

 - Copy the examples and fill values:
 ```bash
 cp .env.example backend/.env.example frontend/.env.example
 # then edit backend/.env.example and frontend/.env.example and copy to backend/.env, frontend/.env
 ```

2) Install dependencies

 - Backend:
 ```powershell
 cd backend
 npm install
 ```

 - Frontend:
 ```powershell
 cd frontend
 npm install
 ```

3) Run servers

 - Backend:
 ```powershell
 cd backend
 npm run dev
 ```

 - Frontend:
 ```powershell
 cd frontend
 npm run dev
 ```

## Useful notes

- If you see CORS errors in development make sure `FRONTEND_URL_DEV` is set to your Vite URL (default `http://localhost:5173`).
- Firebase push functionality requires a service account file (see `FIREBASE_SERVICE_ACCOUNT_PATH`) and `VITE_FIREBASE_VAPID_KEY`.
- The backend will fall back gracefully if `compression` is not installed, but installing it improves responses.

## CI

A simple Node.js workflow is included in `.github/workflows/nodejs-ci.yml` that runs `npm install` and basic checks.

## Contributing

Open a PR with focused changes and include a short description of why the change is needed.

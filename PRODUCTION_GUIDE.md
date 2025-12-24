# GameDay Production Guide

This guide explains how to deploy the GameDay application using Docker.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine.
- [Git](https://git-scm.com/) installed.

## Quick Start

1.  **Clone the repository** (if you haven't already).
2.  **Environment Variables**:
    - Ensure you have your `.env` variables ready.
    - For Docker Compose, you can create a `.env` file in the root directory or set them in `docker-compose.yml`.
    - **Important**: The `MONGO_URI` in `docker-compose.yml` is set to `mongodb://mongo:27017/gameday` to use the internal container.

3.  **Build and Run**:
    Open a terminal in the project root and run:
    ```bash
    docker-compose up --build -d
    ```

4.  **Access the App**:
    - Frontend: `http://localhost`
    - Backend: `http://localhost:5000`

5.  **Stop the App**:
    ```bash
    docker-compose down
    ```

## Troubleshooting

- **Port Conflicts**: If port 80 or 5000 is in use, modify the `ports` section in `docker-compose.yml` (e.g., `"8080:80"`).
- **Database Persistence**: Data is stored in a Docker volume named `mongo-data`. It persists across restarts.

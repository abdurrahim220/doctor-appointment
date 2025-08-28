# Essential Docker Commands

This document provides a quick reference for essential Docker commands.

## Building and Running

- **Build Docker images (using `docker-compose`)**:
  ```bash
  docker-compose build
  ```
  **Stop and remove all containers, networks, and volumes (using `docker-compose`)**:
  ```bash
  docker-compose down
  ```
- **Start containers (using `docker-compose`)**:
  ```bash
  docker-compose up -d
  ```

## Container Management

- **List running containers**:

  ```bash
  docker ps
  ```

- **List all containers (including stopped)**:

  ```bash
  docker ps -a
  ```

- **Stop a running container (by name or ID)**:

  ```bash
  docker stop <container_name_or_id>
  ```

- **Stop all running containers (using `docker-compose`)**:

  ```bash
  docker-compose stop
  ```

- **Remove a stopped container (by name or ID)**:

  ```bash
  docker rm <container_name_or_id>
  ```

-

## Image Management

- **List Docker images**:

  ```bash
  docker images
  ```

- **Delete a Docker image (by name:tag or ID)**:

  ```bash
  docker rmi <image_name:tag_or_id>
  ```

- **Delete all unused Docker images**:
  ```bash
  docker image prune -a
  ```

## Checking Logs

- **View logs for a service (using `docker-compose`)**:

  ```bash
  docker-compose logs <service_name>
  ```

- **View logs for a container (by name or ID)**:
  ```bash
  docker logs <container_name_or_id>
  ```

# Docker Commands Reference

This document provides a comprehensive list of Docker commands for managing your application and Docker environment.

## Application-Specific Commands (Docker Compose)

These commands are tailored for managing your application using `docker-compose`.

### Build and Run

```bash
docker compose up --build
```
> Start or rebuild your application services.

### Prisma Commands

```bash
docker compose run --rm app npm run prisma:generate
```
> Generate the Prisma client after making schema changes.

```bash
docker compose run --rm app npm run prisma:migrate
```
> Apply database migrations.

```bash
docker compose run --rm app npm run prisma:reset
```
> Reset the database (DANGER: This will wipe all data).

```bash
docker compose run --rm -p 5555:5555 app npm run prisma:studio
```
> Run Prisma Studio to manage your database visually.

### Service Management

```bash
docker compose down
```
> Stop all running containers for your application.

```bash
docker rmi prisma_tutorial-app:latest
docker compose build --no-cache
docker compose up
```
> Remove the application image and rebuild it clean.

## Basic Docker Compose Commands

These are general commands for interacting with Docker Compose projects.

```bash
docker-compose up -d
```
> Start services in the background.

```bash
docker-compose down
```
> Stop and remove services, networks, and volumes.

```bash
docker-compose logs
```
> View logs for all services.

```bash
docker-compose logs -f
```
> View real-time logs for all services.

```bash
docker-compose ps
```
> List running services.

```bash
docker-compose build
```
> Build or rebuild services.

```bash
docker-compose up <service_name>
```
> Start a specific service.

```bash
docker-compose stop <service_name>
```
> Stop a specific service.

```bash
docker-compose restart <service_name>
```
> Restart a specific service.

## Volume Management

Commands for managing Docker volumes.

```bash
docker volume ls
```
> List all Docker volumes.

```bash
docker volume create <volume_name>
```
> Create a new Docker volume.

```bash
docker volume inspect <volume_name>
```
> Inspect a Docker volume.

```bash
docker volume rm <volume_name>
```
> Remove a Docker volume.

```bash
docker volume prune
```
> Remove unused Docker volumes.

## Network Management

Commands for managing Docker networks.

```bash
docker network ls
```
> List all Docker networks.

```bash
docker network create <network_name>
```
> Create a new Docker network.

```bash
docker network inspect <network_name>
```
> Inspect a Docker network.

```bash
docker network connect <network_name> <container_name>
```
> Connect a container to a network.

```bash
docker network disconnect <network_name> <container_name>
```
> Disconnect a container from a network.

```bash
docker network rm <network_name>
```
> Remove a Docker network.

```bash
docker network prune
```
> Remove unused Docker networks.

## System Management

Commands for managing the Docker system.

```bash
docker system df
```
> Show Docker disk usage.

```bash
docker system prune
```
> Remove unused Docker data (containers, images, networks).

```bash
docker system prune -a --volumes
```
> Remove all unused Docker data, including volumes.

```bash
docker version
```
> Display Docker version information.

```bash
docker info
```
> Display Docker system-wide information.

## Image Management

Commands for managing Docker images.

```bash
docker images
```
> List all Docker images.

```bash
docker pull <image_name>
```
> Pull an image from a registry.

```bash
docker rmi <image_name>
```
> Remove a Docker image.

```bash
docker image prune
```
> Remove unused Docker images.

```bash
docker image prune -a
```
> Remove all unused Docker images (not just dangling ones).

```bash
docker build -t <image_name> <path_to_dockerfile>
```
> Build an image from a Dockerfile.

```bash
docker history <image_name>
```
> View the history of a Docker image.

```bash
docker save -o <file_name>.tar <image_name>
```
> Save an image to a tar file.

```bash
docker load -i <file_name>.tar
```
> Load an image from a tar file.

## Complete Cleanup

Commands to remove all Docker-related data from your system.

```bash
docker container prune
```
> Remove all stopped containers.

```bash
docker image prune -a
```
> Remove all unused images.

```bash
docker network prune
```
> Remove all unused networks.

```bash
docker volume prune
```
> Remove all unused volumes (use with caution!).

### Verification

To verify that everything has been cleaned up:

```bash
docker ps -a
```
> Check if any containers remain.

```bash
docker images
```
> Check if any images remain.
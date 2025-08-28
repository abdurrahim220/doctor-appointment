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

  > Stop all running containers for your application.

```bash
docker rmi prisma_tutorial-app:latest
docker compose build --no-cache
docker compose up
```

- **Start containers (using `docker-compose`)**:
  ```bash
  docker-compose up -d
  ```

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
```bash
docker image prune
```
> Remove unused Docker images.

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

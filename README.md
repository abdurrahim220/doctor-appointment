# Prisma Tutorial Project

This project is a tutorial demonstrating the use of Prisma with a Node.js application.

## Docker Setup

This project is containerized using Docker for easy setup and deployment.

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git (to clone the repository)

### Getting Started with Docker

1. Clone the repository
2. Copy the example environment file: `cp .env.example .env`
3. Build and start the containers: `docker-compose up -d`
4. The application will be available at: `http://localhost:3000`

### Docker Commands

- Start the application: `docker-compose up -d`
- Stop the application: `docker-compose down`
- View logs: `docker-compose logs -f app`
- Run migrations: `docker-compose exec app yarn prisma:migrate`
- Access Prisma Studio: `docker-compose exec app yarn prisma:studio`
- Reset database: `docker-compose exec app yarn prisma:reset`

### Running the Application

After starting the containers with `docker-compose up -d`, follow these steps:

1. **Run database migrations** to set up your database schema:
   ```bash
   docker-compose exec app yarn prisma:migrate
   ```

2. **Access the application** at:
   ```
   http://localhost:3000
   ```

3. **View API documentation** at:
   ```
   http://localhost:3000/api/v1
   ```

4. **Access Prisma Studio** (database GUI) by running:
   ```bash
   docker-compose exec app yarn prisma:studio
   ```
   Then open http://localhost:5555 in your browser

### Troubleshooting

- **If the application fails to start**, check logs with:
  ```bash
  docker-compose logs -f app
  ```

- **If database connection fails**, ensure PostgreSQL container is running:
  ```bash
  docker-compose ps
  ```

- **To restart the application**:
  ```bash
  docker-compose restart app
  ```

- **To rebuild the application** after code changes:
  ```bash
  docker-compose up -d --build app
  ```

## Folder Structure

```
prisma-tutorial/
├── .dockerignore          # Files to exclude from Docker build
├── .env.example           # Example environment variables
├── .gitignore
├── Dockerfile             # Docker configuration for the application
├── README.md
├── docker-compose.yml     # Docker Compose configuration
├── package.json
├── prisma/                # Prisma schema & migrations
│   └── schema.prisma
├── src/
│   ├── app.ts             # Express app setup (middlewares, routes)
│   ├── config/            # Configuration files
│   │   └── index.ts
│   ├── errors/            # Custom error handling
│   │   └── appError.ts
│   ├── middleware/        # Express middleware
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/           # Feature-specific modules (e.g., user, auth)
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.route.ts
│   │       └── user.service.ts
│   │       └── user.validation.ts
│   ├── prisma/            # Prisma client setup
│   │   └── client.ts
│   ├── route/             # API route definitions
│   │   └── index.ts
│   ├── server.ts          # Entry point
│   ├── types/             # TypeScript type definitions
│   │   └── error.ts
│   └── utils/             # Utility functions
│       ├── asyncHandler.ts
│       └── sendResponse.ts
├── tsconfig.json          # TypeScript configuration
└── yarn.lock              # Yarn lock file
```
# Prisma Tutorial Project

This project is a tutorial demonstrating the use of Prisma with a Node.js application.

## Folder Structure

```
prisma-tutorial/
├── .gitignore
├── README.md
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
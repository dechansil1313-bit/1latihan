# Step-by-Step Implementation Plan

This document provides a comprehensive step-by-step guide for a junior programmer or AI assistant to implement the ElysiaJS + Drizzle + MySQL backend project.

## Step 1: Project Setup & Initialization
1. Initialize a new ElysiaJS project with TypeScript. You can use the official bun template:
   ```bash
   bun create elysia .
   ```
2. Install the necessary dependencies:
   - Core routing: `elysia`
   - Database ORM: `drizzle-orm`, `mysql2`
   - Database Migrations (Dev): `drizzle-kit`
   - Security: `bcryptjs`, `@types/bcryptjs`, `@elysiajs/cookie` (for session management)
   - UI (if building fullstack here): `tailwindcss`, `postcss`, `autoprefixer`, and configure shadcn ui.

## Step 2: Database Configuration
1. Make sure your local MySQL instance is running with user `root` and an empty password.
2. Create a database named `belajar_vibe_coding`.
3. Set up the `src/db/index.ts` file to connect to MySQL using `mysql2` pool and initialize Drizzle ORM.
4. Update `drizzle.config.ts` to point to the local database credentials.

## Step 3: Schema Definition
1. Create `src/models/schema.ts`.
2. Define the `users` table with columns: `id`, `username`, `email`, `password`, `created_at`, `updated_at`.
3. Define the `messages` table with columns: `id`, `user_id`, `content`, `created_at`, `updated_at`.
4. Run Drizzle kit to generate and push the schema to the database.

## Step 4: Folder Structure Setup
Ensure the following directories exist under `src/`:
- `routes/` - For API endpoint handlers.
- `validators/` - For request validation schemas (Zod or TypeBox).
- `services/` - For business logic (e.g., password hashing, db queries).
- `models/` - For database schema definitions.
- `db/` - For database connection and config.
- `utils/` - For shared utility functions.

## Step 5: Implement Services & Utilities
1. **Auth Service (`src/services/auth.ts`)**: Implement `bcryptjs` functions to hash passwords and verify passwords against hashes.
2. **Session Logic (`src/utils/session.ts`)**: Implement logic to create, read, and destroy session cookies securely using `HttpOnly`.

## Step 6: Build API Routes
Implement the following routes using Elysia:
1. **User Routes (`src/routes/users.ts`)**:
   - `POST /api/register`
   - `POST /api/login`
   - `POST /api/logout`
   - `POST /api/users`
   - `GET /api/users/me`
2. **Message Routes (`src/routes/messages.ts`)**:
   - `POST /api/messages`
   - `GET /api/messages`
   - `GET /api/messages/:id`
   - `DELETE /api/messages/:id`
   - `GET /api/messages/user/:user_id`

## Step 7: Tie Everything Together
1. In `src/index.ts`, import your routes and register them with the main Elysia application instance.
2. Ensure the cookie/session plugin is registered at the top level before the routes.
3. Test your endpoints using tools like Postman, curl, or write unit tests.

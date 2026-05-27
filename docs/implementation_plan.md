# Session Authentication Implementation Plan

This is a step-by-step implementation plan for a junior programmer or AI model to implement session-based authentication in our ElysiaJS project.

## Step 1: Database Migration
1. Open your Drizzle schema file (e.g., `src/db/schema.ts`).
2. Add the `session` table definition:
   - `id`: integer, auto-increment, primary key, not nullable.
   - `token`: varchar(255), unique, not nullable (UUID string).
   - `userId`: integer, foreign key to `users.id`, not nullable.
   - `expiredAt`: timestamp, not nullable.
   - `createdAt`: timestamp, auto-set to current timestamp.
3. Run `bun run drizzle db push` (or the equivalent command mapped to `drizzle db push`) to push the schema changes to the MySQL database.

## Step 2: Login API Implementation (`POST /api/user/login`)
1. Create a `POST` route for `/api/user/login`.
2. Accept `email` and `password` in the request body (also optionally handle gmail/google account logins).
3. Query the database to validate the credentials against the `users` table.
4. If invalid (user not found or wrong password/error), return:
   ```json
   { "status": 400, "message": "Login failed", "data": null }
   ```
5. If valid:
   - Generate a UUID for the `token`.
   - Calculate an `expired_at` date.
   - Insert the new session into the `session` table.
   - Use ElysiaJS session management to set a secure `httpOnly` cookie.
   - Return success response:
     ```json
     { 
       "status": 200, 
       "message": "Login successful", 
       "data": { "user_id": 1, "username": "user", "email": "user@example.com", "token": "uuid" } 
     }
     ```

## Step 3: Logout API Implementation (`POST /api/user/logout`)
1. Create a `POST` route for `/api/user/logout`.
2. Accept `email` and `password` in the request body:
   ```json
   { "email": "eko@example.com", "password": "secretPassword" }
   ```
3. Validate the credentials. If user not found, wrong password, or other error, return:
   ```json
   { "status": 400, "message": "Logout failed", "data": null }
   ```
4. If valid:
   - Delete the session record from the database.
   - Clear the session cookie from the client.
   - Return success response:
     ```json
     { "status": 200, "message": "Logout successful", "data": null }
     ```

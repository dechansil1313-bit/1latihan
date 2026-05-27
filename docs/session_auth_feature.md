# Session Authentication Feature Documentation

This document explains the session-based authentication feature for the application. It is designed to be read by a junior programmer or AI model to understand the feature architecture.

## Overview
The application uses session-based authentication via ElysiaJS and secure HTTP-only cookies instead of traditional stateless JWT tokens. Each active session is stored in the database (`session` table) and associated with a user.

## Database Schema (`session` table)
The `session` table tracks all active user sessions with the following columns:
- `id` (integer): Auto-incremented primary key, not nullable.
- `token` (varchar 255): Unique UUID string serving as the session identifier, not nullable.
- `user_id` (integer): Foreign key linking the session to the `users.id`, not nullable.
- `expired_at` (timestamp): The expiration date and time of the session, not nullable.
- `created_at` (timestamp): Auto-set to the current timestamp.

## API Endpoints

### 1. Login
- **Endpoint**: `POST /api/user/login`
- **Description**: Authenticates a user using email/password (or Google account). On success, creates a session in the database and sets an HTTP-only cookie containing the session token.
- **Success Response (200)**:
  ```json
  {
    "status": 200,
    "message": "Login successful",
    "data": {
      "user_id": 1,
      "username": "eko",
      "email": "eko@example.com",
      "token": "uuid"
    }
  }
  ```
- **Failure Response (400)**:
  Returned if email/password/gmail not found, wrong password, or any other error occurs.
  ```json
  {
    "status": 400,
    "message": "Login failed",
    "data": null
  }
  ```

### 2. Logout
- **Endpoint**: `POST /api/user/logout`
- **Description**: Terminates an active session. Requires user credentials in the body. Clears the HTTP-only cookie and deletes the session record from the database.
- **Request Body**:
  ```json
  {
    "email": "eko@example.com",
    "password": "secretPassword"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "status": 200,
    "message": "Logout successful",
    "data": null
  }
  ```
- **Failure Response (400)**:
  Returned if user not found or any other error occurs.
  ```json
  {
    "status": 400,
    "message": "Logout failed",
    "data": null
  }
  ```

## Security
- **HTTP-Only Cookies**: Prevents cross-site scripting (XSS) attacks by making the cookie inaccessible to client-side JavaScript.
- **Session-Based Architecture**: Validating state on the server provides better control over active sessions than stateless token validation.

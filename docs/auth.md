# Authentication Documentation

This application uses a strict **Session-Based Authentication** mechanism. We explicitly avoid stateless Token-Based auth (like JWTs stored in local storage) in favor of secure, server-managed sessions stored via HTTP-only cookies.

## Core Concepts

1. **Password Hashing**
   - We use `bcryptjs` for hashing user passwords before storing them in the `users` table.
   - Passwords are **never** stored in plain text.
   - When verifying a login attempt, the plain text input is compared against the stored hash using `bcrypt.compare`.

2. **Session Mechanism**
   - Upon successful login, the server creates a unique session identifier (or an encrypted session cookie payload if using a secure cookie plugin).
   - This session data contains the `user_id` to identify the user on subsequent requests.
   - ElysiaJS session/cookie mechanisms are used to handle parsing and sending the cookie.

3. **Cookie Security**
   - Cookies must be set with the following flags:
     - `HttpOnly: true` -> Prevents client-side scripts (JavaScript) from accessing the cookie, mitigating XSS attacks.
     - `Secure: true` -> Ensures cookies are only sent over HTTPS (can be false in local development).
     - `SameSite: 'strict'` or `'lax'` -> Mitigates Cross-Site Request Forgery (CSRF) attacks.

## Auth Flows

### 1. Registration (`POST /api/register`)
- Validates the requested `username`, `email`, and `password`.
- Hashes the `password` using `bcryptjs`.
- Inserts the new user into the database.
- (Optional) Automatically logs the user in by establishing a session.

### 2. Login (`POST /api/login`)
- Validates the presence of `email` and `password`.
- Retrieves the user record by `email`.
- Verifies the given `password` against the stored `bcrypt` hash.
- On success, sets the session cookie with the user's ID.

### 3. Logout (`POST /api/logout`)
- Instructs the client browser to clear the session cookie (e.g., setting the expiration date to the past).

### 4. Authenticated Requests (e.g., `GET /api/users/me`)
- The server automatically reads the session cookie attached to the incoming request.
- If the cookie is valid and contains a user ID, the request is authorized.
- If the cookie is missing or invalid, the server responds with a `401 Unauthorized` error.

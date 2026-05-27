# Issue: Session Authentication Feature Implementation

This issue outlines the implementation of session-based authentication using ElysiaJS and Drizzle ORM. This guide is designed for a junior programmer or AI assistant.

## Task Details

- **Database Table (`session`)**:
  - `id`: integer, auto-generated, auto-increment, primary key, not nullable.
  - `token`: varchar(255), unique, not nullable, consist of string of UUID for token user_login.
  - `user_id`: integer, foreign key to `users.id`, not nullable.
  - `expired_at`: timestamp, not nullable.
  - `created_at`: timestamp, auto-set to current timestamp.

- **Login API (`POST /api/user/login`)**:
  - Login using email and password or gmail/google account.
  - Response success: `{ "status": 200, "message": "Login successful", "data": { "user_id": 1, "username": "user", "email": "user@example.com", "token": "uuid" } }`
  - Response fail: `{ "status": 400, "message": "Login failed", "data": null }` (if email/password/gmail not found or wrong password or else error)

- **Logout API (`POST /api/user/logout`)**:
  - Request body: `{"email": "eko@example.com", "password": "secretPassword"}`
  - Response success: `{ "status": 200, "message": "Logout successful", "data": null }`
  - Response fail: `{ "status": 400, "message": "Logout failed", "data": null }` (if user not found or error)

- **Technical Requirements**:
  - Use session-based authentication for users, not token based. Using Elysiajs session and secure http only cookies.
  - Create migration using `drizzle db push`.

## References
- Implementation plan: `docs/implementation_plan.md`
- Feature Documentation: `docs/session_auth_feature.md`

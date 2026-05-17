# API Endpoints Documentation

All endpoints are prefixed with `/api`. Request bodies should be sent as `application/json` unless otherwise specified.

## User & Authentication Routes

### `POST /api/register`
Registers a new user in the system.
- **Request Body:**
  ```json
  {
    "username": "Eko",
    "email": "eko@example.com",
    "password": "secretPassword"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "username": "Eko",
    "email": "eko@example.com",
    "created_at": "2023-10-01T12:00:00Z",
    "updated_at": "2023-10-01T12:00:00Z"
  }
  ```

### `POST /api/login`
Authenticates a user and creates a session cookie.
- **Request Body:**
  ```json
  {
    "email": "eko@example.com",
    "password": "secretPassword"
  }
  ```
- **Response (200 OK):**
  Same as register. Sets `HttpOnly` cookie containing the session.

### `POST /api/logout`
Destroys the current user session.
- **Request Body:**
  ```json
  {
    "email": "eko@example.com",
    "password": "secretPassword"
  }
  ```
  *(Note: Standard logout typically relies entirely on the session cookie rather than credentials, but this matches the specific project requirements.)*
- **Response (200 OK):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### `POST /api/users`
Alternative endpoint for creating a user (with `name` instead of `username`).
- **Request Body:**
  ```json
  {
    "name": "Eko",
    "email": "eko@example.com",
    "password": "secretPassword"
  }
  ```
- **Response (200 OK):** Returns created user data.

### `GET /api/users/me`
Retrieves the profile of the currently logged-in user based on their session cookie.
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "username": "Eko",
    "email": "eko@example.com",
    "created_at": "2023-10-01T12:00:00Z",
    "updated_at": "2023-10-01T12:00:00Z"
  }
  ```

---

## Message Routes

### `POST /api/messages`
Creates a new message.
- **Request Body:**
  ```json
  {
    "user_id": 1,
    "content": "Hello world!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "user_id": 1,
    "content": "Hello world!",
    "created_at": "2023-10-01T12:05:00Z",
    "updated_at": "2023-10-01T12:05:00Z"
  }
  ```

### `GET /api/messages`
Retrieves a list of all messages.
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "content": "Hello world!",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
  ```

### `GET /api/messages/:id`
Retrieves a specific message by its ID.
- **Response (200 OK):** Single message object.

### `DELETE /api/messages/:id`
Deletes a specific message by its ID.
- **Response (200 OK):** The deleted message object.

### `GET /api/messages/user/:user_id`
Retrieves all messages belonging to a specific user.
- **Response (200 OK):** List of message objects belonging to the user.

# API Endpoints Documentation

All endpoints are prefixed with `/api`. Request and response bodies are sent as `application/json` unless otherwise specified.

---

## User & Authentication Routes

### `POST /api/register`
Registers a new user in the system.

* **Request Body:**
  ```json
  {
    "username": "Eko",
    "email": "eko@example.com",
    "password": "secretPassword"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

---

### `POST /api/user/login` [REVISED]
Authenticates a user, establishes a server-side session, and sets a secure `HttpOnly` cookie containing the token. Supports standard email/password or Gmail/Google account email lookup.

* **Request Body:**
  ```json
  {
    "email": "eko@example.com",
    "password": "secretPassword"
  }
  ```
* **Response Success (200 OK):**
  Sets a cookie named `token` (secure, httpOnly, sameSite: strict, path: /) containing the session UUID.
  ```json
  {
    "status": 200,
    "message": "Login successful",
    "data": {
      "user_id": 1,
      "username": "Eko",
      "email": "eko@example.com",
      "token": "4a73722a-8bd1-49b2-a4fe-88c9bb759c25"
    }
  }
  ```
* **Response Fail (400 Bad Request):**
  Returned if the email/password is wrong, the account is not found, or any other validation/runtime error occurs.
  ```json
  {
    "status": 400,
    "message": "Login failed",
    "data": null
  }
  ```

---

### `POST /api/user/logout` [REVISED]
Destroys the current user session in the database and instructs the browser to clear the session cookie.

* **Request Body:**
  ```json
  {
    "email": "eko@example.com",
    "password": "secretPassword"
  }
  ```
* **Response Success (200 OK):**
  Clears the `token` cookie (by removing it or setting expiration to the past).
  ```json
  {
    "status": 200,
    "message": "Logout successful",
    "data": null
  }
  ```
* **Response Fail (400 Bad Request):**
  Returned if the user is not found, or credentials do not match, or an error occurs during session deletion.
  ```json
  {
    "status": 400,
    "message": "Logout failed",
    "data": null
  }
  ```

---

### `GET /api/users/me`
Retrieves the profile of the currently logged-in user based on the session cookie token.

* **Headers:**
  Must supply the secure cookie `token` in the headers.
* **Response (200 OK):**
  ```json
  {
    "id": 1,
    "username": "Eko",
    "email": "eko@example.com",
    "created_at": "2026-05-25T12:00:00Z",
    "updated_at": "2026-05-25T12:00:00Z"
  }
  ```

---

## Message Routes

### `POST /api/messages`
Creates a new message.

* **Request Body:**
  ```json
  {
    "user_id": 1,
    "content": "Hello world!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "id": 1,
    "user_id": 1,
    "content": "Hello world!",
    "created_at": "2026-05-25T12:05:00Z",
    "updated_at": "2026-05-25T12:05:00Z"
  }
  ```

---

### `GET /api/messages`
Retrieves a list of all messages.

* **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "content": "Hello world!",
      "created_at": "2026-05-25T12:05:00Z",
      "updated_at": "2026-05-25T12:05:00Z"
    }
  ]
  ```

---

### `GET /api/messages/:id`
Retrieves a specific message by its ID.

* **Response (200 OK):** Single message object.

---

### `DELETE /api/messages/:id`
Deletes a specific message by its ID.

* **Response (200 OK):** The deleted message object.

---

### `GET /api/messages/user/:user_id`
Retrieves all messages belonging to a specific user.

* **Response (200 OK):** List of message objects belonging to the user.

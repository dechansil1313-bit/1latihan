# Database Documentation

This document explains the database configuration and schema design for the project.

## Technology Stack
- **Database Engine**: MySQL (Localhost)
- **ORM**: Drizzle ORM
- **Driver**: `mysql2`

## Connection Details
The application connects to a local MySQL instance with the following default credentials (configured in `.env`):
- **DATABASE_URL**: `mysql://root:@localhost/belajar_vibe_coding` (configured using a local socket or port)

## Schema Definitions

The schema is defined in `src/db/schema.ts` using Drizzle's MySQL definitions.

---

### `users` Table
Stores user account and authentication information.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto Increment | Unique identifier for the user. |
| `username` | Varchar(255) | Unique, Not Null | The user's display name. |
| `email` | Varchar(255) | Unique, Not Null | The user's email address (used for login). |
| `password` | Varchar(255) | Not Null | The `bcrypt` hashed password. |
| `created_at` | Timestamp | Default: Current Timestamp | When the record was created. |
| `updated_at` | Timestamp | Default: Current Timestamp, On Update: Current Timestamp | When the record was last updated. |

---

### `messages` Table
Stores messages created by users.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto Increment | Unique identifier for the message. |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null | References the user who created the message. |
| `content` | Text | Not Null | The actual message content. |
| `created_at` | Timestamp | Default: Current Timestamp | When the message was created. |
| `updated_at` | Timestamp | Default: Current Timestamp, On Update: Current Timestamp | When the message was last updated. |

---

### `session` Table [NEW]
Stores server-side session information for active user authentications.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto Increment, Not Null | Unique identifier for the session. |
| `token` | Varchar(255) | Unique, Not Null | String of UUID representing the active login token. |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null | References the user who owns this session. |
| `expired_at` | Timestamp | Not Null | Timestamp when the session token expires. |
| `created_at` | Timestamp | Default: Current Timestamp | Timestamp when the session was created. |

---

## Drizzle Configuration
The `drizzle.config.ts` at the root of the project maps the schema files to the database for generating and pushing migrations. 

To sync the schema definitions with the database, run:
```bash
bun run db:push
```
This runs `drizzle-kit push`, which scans the schema file and directly pushes changes to the MySQL database.

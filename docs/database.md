# Database Documentation

This document explains the database configuration and schema design for the project.

## Technology Stack
- **Database Engine**: MySQL (Localhost)
- **ORM**: Drizzle ORM
- **Driver**: `mysql2`

## Connection Details
The application connects to a local MySQL instance with the following default credentials:
- **Host**: `localhost`
- **User**: `root`
- **Password**: `''` (empty)
- **Database Name**: `belajar_vibe_coding`

## Schema Definitions

The schema is defined in `src/models/schema.ts` using Drizzle's MySQL definitions.

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

### `messages` Table
Stores messages created by users.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto Increment | Unique identifier for the message. |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null | References the user who created the message. |
| `content` | Text | Not Null | The actual message content. |
| `created_at` | Timestamp | Default: Current Timestamp | When the message was created. |
| `updated_at` | Timestamp | Default: Current Timestamp, On Update: Current Timestamp | When the message was last updated. |

## Drizzle Configuration
The `drizzle.config.ts` at the root of the project maps the schema files to the database for generating migrations. Remember to run `drizzle-kit generate:mysql` and `drizzle-kit push:mysql` (or equivalent commands) when making schema changes.

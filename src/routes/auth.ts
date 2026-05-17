import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword } from "../services/auth";
import { eq, or } from "drizzle-orm";

export const authRoutes = new Elysia({ prefix: "/api" })
  .post(
    "/register",
    async ({ body, set }) => {
      const { username, email, password } = body;

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(or(eq(users.username, username), eq(users.email, email)))
        .limit(1);

      if (existingUser.length > 0) {
        set.status = 400;
        return { error: "Username or email already exists" };
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      try {
        await db.insert(users).values({
          username,
          email,
          password: passwordHash,
        });

        return { message: "User registered successfully" };
      } catch (error) {
        set.status = 500;
        return { error: "Failed to create user" };
      }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    }
  );

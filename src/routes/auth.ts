import { Elysia, t } from "elysia";
import { db } from "../db";
import { users, session } from "../db/schema";
import { hashPassword, comparePassword } from "../services/auth";
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
  )
  .post(
    "/user/login",
    async ({ body, cookie, set }) => {
      const { email, password } = body;

      try {
        // Find user by email
        const userList = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const user = userList[0];
        if (!user) {
          set.status = 400;
          return {
            status: 400,
            message: "Login failed",
            data: null,
          };
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
          set.status = 400;
          return {
            status: 400,
            message: "Login failed",
            data: null,
          };
        }

        // Generate session token (UUID)
        const token = crypto.randomUUID();

        // Set session expiration (7 days from now)
        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + 7);

        // Insert session into DB
        await db.insert(session).values({
          token,
          userId: user.id,
          expiredAt,
        });

        // Set secure HttpOnly cookie using Elysia cookie helper
        cookie.token.set({
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          expires: expiredAt,
        });

        return {
          status: 200,
          message: "Login successful",
          data: {
            user_id: user.id,
            username: user.username,
            email: user.email,
            token,
          },
        };
      } catch (error) {
        set.status = 400;
        return {
          status: 400,
          message: "Login failed",
          data: null,
        };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/user/logout",
    async ({ body, cookie, set }) => {
      const { email, password } = body;

      try {
        // Find user by email
        const userList = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const user = userList[0];
        if (!user) {
          set.status = 400;
          return {
            status: 400,
            message: "Logout failed",
            data: null,
          };
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
          set.status = 400;
          return {
            status: 400,
            message: "Logout failed",
            data: null,
          };
        }

        // Delete session from DB
        await db.delete(session).where(eq(session.userId, user.id));

        // Clear the cookie
        cookie.token.remove();

        return {
          status: 200,
          message: "Logout successful",
          data: null,
        };
      } catch (error) {
        set.status = 400;
        return {
          status: 400,
          message: "Logout failed",
          data: null,
        };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );

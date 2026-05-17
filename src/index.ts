import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { cookie } from "@elysiajs/cookie";

const app = new Elysia()
  .use(cookie())
  .get("/", () => "Hello Elysia")
  .use(authRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

import "npm:dotenv/config";
import { Hono } from "npm:hono";
import { logger } from "npm:hono/logger";
import { handler } from "./discord/client.ts";
import { api } from "./api/router.ts";

const app = new Hono();

app.use(logger());

app.mount("/api/discord", handler);
app.route("/", api);
app.get("/health", (c) => {
  c.status(200);
  return c.text("OK");
});

Deno.serve(app.fetch);

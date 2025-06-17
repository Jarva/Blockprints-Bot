import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: Deno.env.get("TURSO_DATABASE_URL")!,
    authToken: Deno.env.get("TURSO_AUTH_TOKEN"),
  },
});

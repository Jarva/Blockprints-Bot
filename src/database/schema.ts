import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { type Snowflake } from "npm:@buape/carbon";

export const subscriptions = sqliteTable("subscriptions", {
  channel: text().primaryKey().$type<Snowflake>(),
  mods: text({ mode: "json" }).$type<string[]>().default([]),
  report: text().$type<Snowflake>(),
  shouldGenerateThread: integer({ mode: "boolean" }).default(true),
});

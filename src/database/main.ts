import { drizzle } from "drizzle-orm/libsql/node";
import { subscriptions } from "./schema.ts";
import { type Snowflake } from "@buape/carbon";
import { eq, sql } from "drizzle-orm";

export const db = drizzle({
  connection: {
    url: Deno.env.get("TURSO_DATABASE_URL")!,
    authToken: Deno.env.get("TURSO_AUTH_TOKEN"),
  },
});

export type Subscription = typeof subscriptions.$inferInsert;

export const addSubscription = async (subscription: Subscription) => {
  return await db.insert(subscriptions)
    .values(subscription)
    .onConflictDoUpdate({
      target: subscriptions.channel,
      set: subscription,
    }).returning();
};

export const deleteSubscription = async (channel: Snowflake) => {
  await db.delete(subscriptions)
    .where(
      eq(subscriptions.channel, channel),
    );
};

export const getSubscription = async (channel: Snowflake) => {
  const [subscription] = await db.select()
    .from(subscriptions)
    .where(
      eq(subscriptions.channel, channel),
    )
    .limit(1);
  return subscription;
};

function modsContainsAny(mods: string[]) {
  return sql`
    subscriptions.channel IN (
      SELECT subscriptions.channel
      FROM subscriptions, json_each(subscriptions.mods)
      WHERE json_each.value IN (${
    sql.join(mods.map((v) => sql`${v}`), sql`, `)
  })
    )
  `;
}

export const getSubscriptionsForMods = async (mods: string[]) => {
  return await db
    .select()
    .from(subscriptions)
    .where(modsContainsAny(mods));
};

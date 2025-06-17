import { Hono } from "npm:hono";
import { getSchematicContent } from "../discord/services/schematic.ts";
import { getSubscriptionsForMods } from "../database/main.ts";
import {
  GuildTextChannel,
  serializePayload,
  ThreadAutoArchiveDuration,
} from "@buape/carbon";
import { client } from "../discord/client.ts";
import {
  addReaction,
  createThread,
  editMessage,
  sendRawMessage,
} from "../discord/helpers.ts";
import { channelLink } from "@discordjs/formatters";

export const api = new Hono();

api.post("/api/notification/schematic/:schematicId", async (c) => {
  const apiKey = c.req.header("x-api-key");
  if (!apiKey || apiKey !== Deno.env.get("NOTIFICATION_API_KEY")) {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }

  try {
    const [schematic, message] = await getSchematicContent(
      c.req.param("schematicId"),
    );
    const body = serializePayload(message);
    const subscriptions = await getSubscriptionsForMods([
      ...schematic.mods,
      "*",
    ]);

    for (const subscription of subscriptions) {
      const channel = await client.fetchChannel(subscription.channel);
      if (channel instanceof GuildTextChannel) {
        try {
          const message = await sendRawMessage(client, channel.id, body);
          await addReaction(
            client,
            message,
            "minecraft_heart:1384437700525822062",
          );
          if (subscription.shouldGenerateThread) {
            const thread = await createThread(
              client,
              message,
              {
                name: `Discussion: ${schematic.name}`,
                auto_archive_duration: ThreadAutoArchiveDuration.OneWeek,
              },
            );
            const link = channelLink(thread.id, channel.guildId);
            await editMessage(client, message, {
              content: link,
            });
          }
        } catch (error) {
          console.error(
            `Failed while updating subscription for ${subscription.channel}`,
            error,
          );
        }
      }
    }

    c.status(200);
    return c.json({ data: "OK" });
  } catch (error) {
    c.status(400);
    return c.json({ error });
  }
});

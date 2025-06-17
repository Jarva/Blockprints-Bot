import {
  APIMessage,
  Client,
  MessagePayload,
  RESTPatchAPIChannelMessageResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  RESTPostAPIChannelThreadsJSONBody,
  RESTPostAPIChannelThreadsResult,
  RESTPutAPIChannelMessageReactionResult,
  Routes,
  serializePayload,
} from "npm:@buape/carbon";

export const sendMessage = async (
  client: Client,
  channel: string,
  body: MessagePayload,
) => {
  const serialized = serializePayload(body);
  return await sendRawMessage(client, channel, serialized);
};

export const sendRawMessage = async (
  client: Client,
  channel: string,
  body: RESTPostAPIChannelMessageJSONBody,
) => {
  const route = Routes.channelMessages(channel);
  return await client.rest.post(route, {
    body,
  }) as RESTPostAPIChannelMessageResult;
};

export const editMessage = async (
  client: Client,
  message: APIMessage,
  body: MessagePayload,
) => {
  const route = Routes.channelMessage(message.channel_id, message.id);
  return await client.rest.patch(route, {
    body,
  }) as RESTPatchAPIChannelMessageResult;
};

export const addReaction = async (
  client: Client,
  message: APIMessage,
  emoji: string,
) => {
  const route = Routes.channelMessageOwnReaction(
    message.channel_id,
    message.id,
    encodeURI(emoji),
  );
  return await client.rest.put(route) as RESTPutAPIChannelMessageReactionResult;
};

export const createThread = async (
  client: Client,
  message: APIMessage,
  body: RESTPostAPIChannelThreadsJSONBody,
) => {
  const route = Routes.threads(message.channel_id, message.id);
  return await client.rest.post(route, {
    body,
  }) as RESTPostAPIChannelThreadsResult;
};

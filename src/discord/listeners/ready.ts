import {
  Client,
  ListenerEvent,
  ListenerEventData,
  ReadyListener,
  Routes,
} from "npm:@buape/carbon";

const env = Deno.env.toObject();

export class Ready extends ReadyListener {
  async handle(
    data: ListenerEventData[typeof ListenerEvent.Ready],
    client: Client,
  ) {
    console.log(`Ready! Logged in as ${data.user.username}`);
    console.log(`Serving ${data.guilds.length} servers`);

    // for (
    //   const server of [
    //     "1173375132606140476",
    //     "743298050222587978",
    //     "634618557464051772",
    //   ]
    // ) {
    //   client.rest.put(
    //     Routes.applicationGuildCommands(
    //       client.options.clientId,
    //       server,
    //     ),
    //     { body: [] },
    //   )
    //     .then(() => console.log("Successfully deleted all guild commands."))
    //     .catch(console.error);
    // }

    // for global commands
    // client.rest.put(Routes.applicationCommands(client.options.clientId), {
    //   body: [],
    // })
    //   .then(() => console.log("Successfully deleted all application commands."))
    //   .catch(console.error);
  }
}

import { Client } from "npm:@buape/carbon";
import { createHandler } from "npm:@buape/carbon/adapters/fetch";
import { ShardingPlugin } from "npm:@buape/carbon/sharding";
import { CommandDataPlugin } from "npm:@buape/carbon/command-data";
import { Ready } from "./listeners/ready.ts";
import commands from "./commands.ts";
import { SchematicReportButton } from "./components/buttons/schematic/SchematicReportButton.ts";

const env = Deno.env.toObject();

export const client = new Client({
  baseUrl: env.BASE_URL,
  disableDeployRoute: false,
  deploySecret: env.DEPLOY_SECRET,
  clientId: env.DISCORD_CLIENT_ID,
  publicKey: env.DISCORD_PUBLIC_KEY,
  token: env.DISCORD_TOKEN,
  // devGuilds: ["634618557464051772"],
  autoDeploy: true,
}, {
  commands,
  listeners: [
    new Ready(),
  ],
  components: [new SchematicReportButton()],
}, [
  new ShardingPlugin({
    intents: 0,
  }),
  new CommandDataPlugin(),
]);

export const handler = createHandler(client);

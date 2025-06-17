import { BaseCommand } from "npm:@buape/carbon";
import { SchematicCommand } from "./commands/schematic.ts";
import { SubscribeCommand } from "./commands/subscribe.ts";
import { UnsubscribeCommand } from "./commands/unsubscribe.ts";

export default [
  new SchematicCommand(),
  new SubscribeCommand(),
  new UnsubscribeCommand(),
] as BaseCommand[];

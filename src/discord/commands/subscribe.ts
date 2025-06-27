import {
  ApplicationCommandOptionType,
  Command,
  CommandInteraction,
  CommandOptions,
  InteractionContextType,
  Permission,
} from "npm:@buape/carbon";
import { addSubscription, Subscription } from "../../database/main.ts";
import {Result} from "npm:typescript-result@3.1.1";

export class SubscribeCommand extends Command {
  name = "subscribe";
  description = "Subscribe to new builds for mod namespaces";

  permission = Permission.ManageGuild;

  options: CommandOptions = [
    {
      name: "report",
      description: "The channel to send reports",
      type: ApplicationCommandOptionType.Channel,
    },
    {
      name: "thread",
      description: "Should generate thread for each post?",
      type: ApplicationCommandOptionType.Boolean,
    },
    {
      name: "mods",
      description:
        "A comma separated list of mod namespaces (* for all builds)",
      type: ApplicationCommandOptionType.String,
    },
  ];

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  async run(interaction: CommandInteraction) {
    await interaction.defer({ ephemeral: true });

    const mods =
      interaction.options.getString("mods")?.split(",").map((mod) =>
        mod.trim()
      ) ?? [];

    const [report, channelError] = await Result.fromAsyncCatching(
      interaction.options.getChannel("report")
    ).toTuple();

    if (channelError) {
      return interaction.reply({
        content: "Unable to access report channel"
      });
    }

    const subscription: Subscription = {
      channel: interaction.channel!.id,
      mods,
      report: report?.id ?? null,
      shouldGenerateThread: interaction.options.getBoolean("thread"),
    };

    await addSubscription(subscription);

    await interaction.reply({
      content: "Subscription added",
    });
  }
}

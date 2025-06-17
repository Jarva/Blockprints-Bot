import {
  ApplicationCommandOptionType,
  Command,
  CommandInteraction,
  CommandOptions,
  InteractionContextType,
  Permission,
} from "npm:@buape/carbon";
import { deleteSubscription } from "../../database/main.ts";

export class UnsubscribeCommand extends Command {
  name = "unsubscribe";
  description = "Unsubscribe to builds for a channel";

  permission = Permission.ManageGuild;

  options: CommandOptions = [
    {
      name: "channel",
      description: "The channel to unsubscribe",
      type: ApplicationCommandOptionType.Channel,
    },
  ];

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  async run(interaction: CommandInteraction) {
    await interaction.defer({ ephemeral: true });

    const channel = await interaction.options.getChannel("channel") ??
      interaction.channel!;

    await deleteSubscription(channel.id);

    await interaction.reply({
      content: "Subscription deleted",
    });
  }
}

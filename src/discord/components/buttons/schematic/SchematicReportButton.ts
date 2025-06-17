import { getSubscription } from "../../../../database/main.ts";
import { Button, ButtonInteraction, ButtonStyle } from "npm:@buape/carbon";
import { messageLink } from "@discordjs/formatters";
import { sendMessage } from "../../../helpers.ts";

export class SchematicReportButton extends Button {
  customId = "report-schematic";
  label = "Report";
  style = ButtonStyle.Danger;

  async report(interaction: ButtonInteraction, channelId: string) {
    const message = messageLink(
      interaction.channel!.id,
      interaction.message!.id,
      interaction.guild!.id,
    );
    await sendMessage(interaction.client, channelId, {
      content: `Report received from ${interaction.user}\n${message}`,
    });
  }

  async run(interaction: ButtonInteraction) {
    const { id } = interaction.channel!;
    const subscription = await getSubscription(id);
    if (subscription && subscription.report !== null) {
      await this.report(interaction, subscription.report);
    }
    await this.report(interaction, "1244647477387202604");
  }
}

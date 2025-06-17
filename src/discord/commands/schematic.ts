import {
  ApplicationCommandOptionType,
  Command,
  CommandInteraction,
  CommandOptions,
  InteractionContextType,
} from "npm:@buape/carbon";
import { getSchematicContent } from "../services/schematic.ts";

export class SchematicCommand extends Command {
  name = "schematic";
  description = "View a Schematic";

  options: CommandOptions = [
    {
      name: "id",
      description: "The ID of the schematic",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ];

  contexts: InteractionContextType[] = [InteractionContextType.Guild];

  async run(interaction: CommandInteraction) {
    await interaction.defer();

    const schematicId = interaction.options.getString("id");

    if (!schematicId) {
      return interaction.reply({
        content: "No Schematic ID provided",
      });
    }

    try {
      const [_, response] = await getSchematicContent(schematicId);
      return await interaction.reply(response);
    } catch (error) {
      console.error(error);
    }
  }
}

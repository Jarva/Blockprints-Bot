import { Embed, MessagePayload, Row } from "npm:@buape/carbon";
import { BASE_URL, CDN_BASE_URL, client } from "../http/blockprints/client.ts";
import { Schematic } from "../http/blockprints/types.ts";
import { SchematicViewButton } from "../components/buttons/schematic/SchematicViewButton.ts";
import { SchematicReportButton } from "../components/buttons/schematic/SchematicReportButton.ts";

export const getSchematicContent = async (
  schematicId: string,
): Promise<[Schematic, MessagePayload]> => {
  const res = await client.get(`schematics/${schematicId}`);
  const data = await res.json<Schematic>();

  if (data === null) {
    throw new Error("Unable to retrieve schematic.");
  }

  if (!data.public) {
    throw new Error("Schematic is not public.");
  }

  const mostUsedBlocks = Object.entries(data.blockCount).toSorted((
    [_k1, v1],
    [_k2, v2],
  ) => v2 - v1).slice(0, 5);

  const [_, fCount] = mostUsedBlocks[0];
  const maxLength = fCount.toString().length;

  const mostUsedBlocksText = mostUsedBlocks.map(([block, count]) =>
    `${count.toString().padStart(maxLength, " ")} ${block}`
  );
  const modCount = data.mods.filter((mod) => mod !== "minecraft").length;

  const url = `${BASE_URL}schematic/${data.id}`;

  const [firstImage] = data.previewImages;

  const embed = new Embed({
    title: `${data.name} by ${data.playerName}`,
    url,
    description: `${data.description}`,
    image: {
      url: `${CDN_BASE_URL}${firstImage}`,
    },
    footer: {
      text: `${data.id}`,
    },
    timestamp: new Date(data.createdAt._seconds * 1000).toISOString(),
    color: 0x231631,
    fields: [
      {
        name: "5 Most Used Blocks",
        value: mostUsedBlocksText.join("\n"),
      },
      {
        name: "Mod Count",
        value: `${modCount}`,
        inline: true,
      },
      {
        name: "Size",
        value: `${data.size.join("x")}`,
        inline: true,
      },
    ],
  });

  const row = new Row([
    new SchematicViewButton(url),
    new SchematicReportButton(),
  ]);

  return [data, {
    embeds: [embed],
    components: [row],
  }];
};

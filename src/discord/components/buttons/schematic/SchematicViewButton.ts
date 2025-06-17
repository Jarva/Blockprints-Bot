import { LinkButton } from "npm:@buape/carbon";

export class SchematicViewButton extends LinkButton {
  label = "View Schematic";

  constructor(public url: string) {
    super();
    this.url = url;
  }
}

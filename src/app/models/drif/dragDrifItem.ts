import {Drif} from "@models/drif/drif";

export interface DragDrifItem {
  drif: Drif | null,
  fromSlot: number,
  item: string
}

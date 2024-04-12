import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";

export interface RarWithDrifs {
  slot: InventorySlot,
  rank: number,
  ornaments: number,
  sidragaBoost: boolean,
  drifItem1: Drif | null;
  drifItem2: Drif | null;
  drifItem3: Drif | null;
}

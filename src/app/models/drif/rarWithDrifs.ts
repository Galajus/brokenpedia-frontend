import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";

export interface RarWithDrifs {
  id?: number,
  slot: InventorySlot,
  rank: number,
  ornaments: number,
  sidragaBoost: boolean,
  epikBoost: boolean,
  drifItems: Drif[];
  //Compatibility
  drifItem1?: Drif | null;
  drifItem2?: Drif | null;
  drifItem3?: Drif | null;
}

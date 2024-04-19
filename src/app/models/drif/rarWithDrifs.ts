import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";
import {DragDrifItem} from "@models/drif/dragDrifItem";

export interface RarWithDrifs {
  slot: InventorySlot,
  rank: number,
  ornaments: number,
  sidragaBoost: boolean,
  epikBoost: boolean,
  drifItem1: Drif | null;
  drifItem2: Drif | null;
  drifItem3: Drif | null;
  /*dragDrop: DragDrifItem[]*/
}

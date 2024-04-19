import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";

export interface DragDrifItem {
  drif: Drif | null,
  fromSlot: number,
  inventorySlot: InventorySlot
}

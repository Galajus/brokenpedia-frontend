import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";
import {DrifDto} from "@models/drif/drifDto";

export interface RarWithDrifsDto {
  id?: number,
  drifBuidId?: number,
  slot: InventorySlot,
  rank: number,
  ornaments: number,
  sidragaBoost: boolean,
  epikBoost: boolean,
  drifItems: DrifDto[]
}

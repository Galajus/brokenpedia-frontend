import {InventorySlot} from "./inventorySlot";
import {UpgradeTarget} from "../../items/upgradeTarget";

export interface LocalInventory {
  items: LocalItem[]
}

export interface LocalItem {
  id: number,
  supportedSlot: InventorySlot,
  incrustationLevel: number,
  incrustationTarget: number,
  upgradeTarget: UpgradeTarget,
  upgradeLevel: number
  drifs: LocalDrif[]
}

export interface LocalDrif {
  tier: number,
  level: number,
  drifId: number
}

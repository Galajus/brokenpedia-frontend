import {InventorySlot} from "./inventorySlot";
import {UpgradeTarget} from "../../items/upgradeTarget";
import {IncrustationTarget} from "@models/items/incrustationTarget";

export interface LocalInventory {
  items: LocalItem[]
}

export interface LocalItem {
  id: number,
  supportedSlot: InventorySlot,
  incrustationLevel: number,
  incrustationTarget: IncrustationTarget,
  upgradeTarget: UpgradeTarget,
  upgradeLevel: number
  drifs: LocalDrif[]
}

export interface LocalDrif {
  tier: number,
  level: number,
  drifId: number
}

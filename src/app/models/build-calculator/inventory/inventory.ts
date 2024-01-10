import {Drif} from "@models/drif/drif";
import {LegendaryItem} from "@models/items/legendaryItem";
import {IncrustableItem} from "@models/items/incrustableItem";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";
import {Orb} from "@models/orb/orb";
import {UpgradeTarget} from "@models/items/upgradeTarget";

export interface Inventory {
  id?: number,
  items: InventoryItem[]

}

export interface InventoryDrif {
  tier: number,
  level: number,
  drif: Drif
}

export interface InventoryItem extends LegendaryItem, IncrustableItem {
  id?: number,
  inventoryId?: number,
  supportedSlot: InventorySlot,
  drifs: InventoryDrif[],
  orb?: Orb,
  drifBoost: number,
  orbBoost: number,
  upgradeBoost: number,
  upgradeTarget: UpgradeTarget,
  upgradeLevel: number
}

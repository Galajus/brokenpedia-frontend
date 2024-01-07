import {InventorySlot} from "./inventorySlot";
import {InventoryDrif} from "./inventoryDrif";
import {LegendaryItem} from "../../items/legendaryItem";
import {Orb} from "../../orb/orb";
import {UpgradeTarget} from "../../items/upgradeTarget";
import {IncrustableItem} from "../../items/incrustableItem";

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

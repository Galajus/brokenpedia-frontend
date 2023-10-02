import {Orb} from "../../../../common/model/orb/orb";
import {LegendaryItem} from "../../../../common/model/items/legendaryItem";
import {IncrustableItem} from "../../../../common/model/items/incrustableItem";
import {InventorySlot} from "./inventorySlot";
import {InventoryDrif} from "./inventoryDrif";
import {UpgradeTarget} from "../../../../common/model/items/upgradeTarget";

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

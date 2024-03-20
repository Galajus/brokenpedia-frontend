import {ItemType} from "./itemType";
import {DamageType} from "./damageType";
import {Monster} from "../gameentites/monster";
import {ItemFamily} from "./itemFamily";
import {ItemSet} from "@models/set/itemSet";

export interface LegendaryItem {

  id?: number,
  name: string,
  translatedName?: string,
  family: ItemFamily,
  itemSet?: ItemSet,
  droppingMonsters: Monster[],
  type: ItemType,
  weight: number,
  rank: number,
  capacity?: number,
  value: number,

  requiredLevel?: number,
  requiredStrength?: number,
  requiredDexterity?: number,
  requiredPower?: number,
  requiredKnowledge?: number,
  damage?: number,
  damageType?: DamageType,

  strength?: number,
  dexterity?: number,
  power?: number,
  knowledge?: number,
  health?: number,
  mana?: number,
  stamina?: number,

  armorSlashing?: number,
  armorCrushing?: number,
  armorPiercing?: number,
  mentalResistance?: number,
  fireResistance?: number,
  energyResistance?: number,
  coldResistance?: number
}

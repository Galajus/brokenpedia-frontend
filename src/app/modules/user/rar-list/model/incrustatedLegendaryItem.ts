import {MonsterWithIncrustatedLegendaryItems} from "./monsterWithIncrustatedLegendaryItems";
import {ItemType} from "../../../../common/model/items/itemType";
import {DamageType} from "../../../../common/model/items/damageType";
import {LegendaryItem} from "../../../../common/model/items/legendaryItem";
import {ItemFamily} from "../../../../common/model/items/itemFamily";

export interface IncrustatedLegendaryItem extends LegendaryItem {
  id?: number,
  name: string,
  translatedName?: string,
  droppingMonsters: MonsterWithIncrustatedLegendaryItems[],
  family: ItemFamily,
  type: ItemType,
  weight: number,
  rank: number,
  capacity: number,
  value: number,
  incrustationLevel?: number,

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

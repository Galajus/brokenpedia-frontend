import {MonsterWithIncrustatedLegendaryItems} from "./monsterWithIncrustatedLegendaryItems";
import {ItemType} from "../../../../common/model/items/itemType";
import {DamageType} from "../../../../common/model/items/damageType";

export interface IncrustatedLegendaryItem {
  id?: number,
  name: string,
  droppingMonsters: MonsterWithIncrustatedLegendaryItems[],
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

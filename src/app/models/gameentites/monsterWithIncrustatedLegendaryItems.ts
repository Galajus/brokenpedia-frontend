import {IncrustatedLegendaryItem} from "../items/incrustatedLegendaryItem";
import {MonsterType} from "./monsterType";

export interface MonsterWithIncrustatedLegendaryItems {
  id?: number,
  name: string,
  translatedName?: string,
  type: MonsterType,
  legendaryDrops: IncrustatedLegendaryItem[]
}

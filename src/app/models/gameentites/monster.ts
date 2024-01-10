import {MonsterType} from "./monsterType";
import {LegendaryItem} from "../items/legendaryItem";
import {IncrustatedLegendaryItem} from "@models/items/incrustatedLegendaryItem";

export interface Monster {
  id?: number,
  name: string,
  type: MonsterType,
  legendaryDrops: LegendaryItem[]
}

export interface MonsterWithIncrustatedLegendaryItems {
  id?: number,
  name: string,
  translatedName?: string,
  type: MonsterType,
  legendaryDrops: IncrustatedLegendaryItem[]
}

import {MonsterType} from "./monsterType";
import {LegendaryItem} from "../items/legendaryItem";

export interface Monster {
  id?: number,
  name: string,
  type: MonsterType,
  legendaryDrops: LegendaryItem[]
}

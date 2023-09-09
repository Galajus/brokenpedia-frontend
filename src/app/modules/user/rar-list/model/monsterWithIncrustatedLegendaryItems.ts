import {MonsterType} from "../../../../common/model/gameentites/monsterType";
import {IncrustatedLegendaryItem} from "./incrustatedLegendaryItem";

export interface MonsterWithIncrustatedLegendaryItems {
  id?: number,
  name: string,
  translatedName?: string,
  type: MonsterType,
  legendaryDrops: IncrustatedLegendaryItem[]
}

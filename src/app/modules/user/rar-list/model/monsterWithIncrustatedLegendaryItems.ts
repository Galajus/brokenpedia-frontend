import {MonsterType} from "../../../../common/model/gameentites/monsterType";
import {IncrustatedLegendaryItem} from "./incrustatedLegendaryItem";

export interface MonsterWithIncrustatedLegendaryItems {
  id?: number,
  name: string,
  type: MonsterType,
  legendaryDrops: IncrustatedLegendaryItem[]
}

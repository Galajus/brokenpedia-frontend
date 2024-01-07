import {ShardsByOrnaments} from "./shardsByOrnaments";

export interface ShardsByTier {
  tier: number,
  shardAmountSyng: number,
  shardAmountSyngWithInhi: number,
  requiredEsencesSyng: number
  shardsByOrnament: Array<ShardsByOrnaments>
}

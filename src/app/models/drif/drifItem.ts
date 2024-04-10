import {PsychoMod} from "@models/items/psychoMod";
import {DrifCategory} from "@models/drif/drifCategory";

export interface DrifItem {
  tier: number,
  psychoMod: PsychoMod,
  level: number,
  startPower: number,
  psychoGrowByLevel: number,
  category: DrifCategory,
  shortName: string
}

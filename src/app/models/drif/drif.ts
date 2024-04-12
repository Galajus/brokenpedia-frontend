import {PsychoMod} from "../items/psychoMod";
import {DrifCategory} from "@models/drif/drifCategory";

export interface Drif {
  id: number,
  shortName: string,
  startPower: number,
  psychoGrowByLevel: number,
  category: DrifCategory,
  psychoMod: PsychoMod,
  tier?: number,
  level?: number
}

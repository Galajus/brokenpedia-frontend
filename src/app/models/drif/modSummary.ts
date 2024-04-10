import {PsychoMod} from "../items/psychoMod";
import {DrifCategory} from "./drifCategory";

export interface ModSummary {
  mod: PsychoMod,
  drifName: string
  amountDrifs: number,
  modSum: number,
  category: DrifCategory,
  reducedValue?: number
  reducedPercent?: number
  max?: number
}

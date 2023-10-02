import {PsychoMod} from "../../../../common/model/psychoMod";
import {DrifCategory} from "../../../../common/model/drif/drifCategory";

export interface ModSummary {
  mod: PsychoMod,
  drifName: string
  amountDrifs: number,
  modSum: number,
  category: string | DrifCategory,
  reducedValue?: number
  reducedPercent?: number
  max?: number
}

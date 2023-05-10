import {PsychoMod} from "./psychoMod";

export interface ModSummary {
  mod: PsychoMod,
  drifName: string
  amountDrifs: number,
  modSum: number,
  category: string,
  max?: number
}

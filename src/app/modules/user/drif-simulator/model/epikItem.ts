import {PsychoMod} from "../../../../common/model/psychoMod";

export interface EpikItem {
  indexNumber: number,
  name: string,
  drifsTier: number,
  psychoModPA: PsychoMod,
  psychoModCrit: PsychoMod,
  psychoModDedicated: PsychoMod
  booster: number

}

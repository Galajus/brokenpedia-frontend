import {PsychoMod} from "../items/psychoMod";


export interface EpikItem {
  indexNumber: number,
  name: string,
  drifsTier: number,
  psychoModPA: PsychoMod,
  psychoModCrit: PsychoMod,
  psychoModDedicated: PsychoMod
  booster: number

}

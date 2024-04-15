import {PsychoMod} from "../../items/psychoMod";

export interface EpikItem {
  indexNumber: number,
  name: string,
  drifsTier: number,
  psychoModPA: PsychoMod,
  psychoModCrit: PsychoMod,
  psychoModDedicated: PsychoMod
}

const epikItems: EpikItem[] = [
  {
    indexNumber: 13,
    name: "Żmij",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.DOUBLE_HIT_CHANCE
  },
  {
    indexNumber: 14,
    name: "Gorthdar",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.EXTRA_FIRE_DAMAGE
  },
  {
    indexNumber: 15,
    name: "Attawa",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.MAGICAL_HIT_MODIFIER
  },
  {
    indexNumber: 16,
    name: "Imisindo",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.RANGE_HIT_MODIFIER
  },
  {
    indexNumber: 17,
    name: "Washi",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.PHYSICAL_HIT_MODIFIER
  },
  {
    indexNumber: 18,
    name: "Allenor",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.PHYSICAL_DAMAGE_INCREASE
  },
  {
    indexNumber: 19,
    name: "Latarnia Życia",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.MANA_DRAIN
  }
]

export default epikItems;

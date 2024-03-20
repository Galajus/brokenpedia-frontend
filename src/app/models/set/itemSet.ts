import {Profession} from "@models/gameentites/profession";
import {LegendaryItem} from "@models/items/legendaryItem";
import {PsychoMod} from "@models/items/psychoMod";

export interface ItemSet {
  id: number,
  name: string,
  requiredClass: Profession,
  setLegendaryItems: Array<LegendaryItem>,
  psychoEffects: Array<SetPsychoEffect>,
  customEffects: Array<SetCustomEffect>,
}

export interface SetPsychoEffect {
  id: number,
  effect: PsychoMod,
  value: number
}

export interface SetCustomEffect {
  id: number,
  effect: string,
  value: number
}

import {DrifCategory} from "@models/drif/drifCategory";
import {PsychoMod} from "@models/items/psychoMod";

export interface TableDrif {
  id: number,
  shortName: string,
  startPower: number,
  psychoGrowByLevel: number,
  category: DrifCategory,
  psychoMod: PsychoMod,
  forRemoval: boolean,
  power?: number,
  modValue?: number
}

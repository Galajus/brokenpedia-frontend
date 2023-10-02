import {PsychoMod} from "../psychoMod";
import {DrifCategory} from "./drifCategory";

export interface Drif {
  id: number,
  shortName: string,
  startPower: number,
  psychoGrowByLevel: number,
  category: DrifCategory,
  psychoMod: PsychoMod

}

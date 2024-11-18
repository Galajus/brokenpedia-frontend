import {OrbType} from "./orbType";

export interface Orb {
  id?: number,
  effect: string,
  type: OrbType,
  startBonus: number,
  shortName: string
}

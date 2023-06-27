import {DrifItem} from "./drifItem";

export interface RarWithDrifs {
  slot: string,
  rank: number,
  ornaments: number,
  drifItem1: DrifItem | null;
  drifItem2: DrifItem | null;
  drifItem3: DrifItem | null;
}

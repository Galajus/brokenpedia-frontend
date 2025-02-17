import {RarWithDrifs} from "./rarWithDrifs";
import {Drif} from "@models/drif/drif";

export interface DrifBuild {
  name: string,
  critEpicModLevel?: number,
  dedicatedEpicModLevel?: number,
  rarsWithDrifs: RarWithDrifs[];
  backpack: Drif[];
}

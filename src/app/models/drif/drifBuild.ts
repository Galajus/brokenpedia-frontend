import {RarWithDrifs} from "./rarWithDrifs";
import {ProfileDto} from "@models/user/profileDto";
import {Drif} from "@models/drif/drif";

export interface DrifBuild {
  id?: number,
  owner?: ProfileDto,
  name: string,
  critEpicModLevel?: number,
  dedicatedEpicModLevel?: number,
  rarsWithDrifs: RarWithDrifs[];
  backpack: Drif[];
}

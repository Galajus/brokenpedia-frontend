import {PublicProfile} from "@models/user/publicProfile";
import {DrifDto} from "@models/drif/drifDto";
import {RarWithDrifsDto} from "@models/drif/rarWithDrifsDto";

export interface DrifBuildDto {
  id?: number,
  owner?: PublicProfile,
  name: string,
  critEpicModLevel: number,
  dedicatedEpicModLevel: number,
  rarsWithDrifs: RarWithDrifsDto[],
  backpack: DrifDto[]
}

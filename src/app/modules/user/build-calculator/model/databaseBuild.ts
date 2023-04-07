import {SimpleBuild} from "./simpleBuild";
import {BuildLiker} from "./buildLiker";
import {ProfileDto} from "./profileDto";

export interface DatabaseBuild {
  id: number,
  profile: ProfileDto,
  buildName: string,
  shortDescription: string,
  description: string,
  liking: Array<BuildLiker>,
  hidden: boolean,
  pvpBuild: boolean,
  buildDetails: SimpleBuild
}

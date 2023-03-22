import {SimpleBuild} from "./simpleBuild";
import {BuildLiker} from "./buildLiker";

export interface DatabaseBuild {
  id: number,
  ownerUuid: string,
  buildName: string,
  shortDescription: string,
  description: string,
  liking: Array<BuildLiker>,
  hidden: boolean,
  pvpBuild: boolean,
  buildDetails: SimpleBuild
}

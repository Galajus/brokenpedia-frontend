import {SimpleBuild} from "./simpleBuild";

export interface DatabaseBuild {
  id: number,
  ownerUUID: string,
  name: string,
  shortDescription: string,
  description: string,
  likes: number,
  hidden: boolean,
  pvpBuild: boolean,
  //comments: Comment[],
  build: SimpleBuild
}

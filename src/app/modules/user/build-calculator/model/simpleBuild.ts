import {DatabaseBuild} from "./databaseBuild";
import {BuildSkillStatData} from "./buildSkillStatData";

export interface SimpleBuild {

  id: number,
  profession: string,
  level: number,
  skillStatData: BuildSkillStatData[],
  buildId: number
}

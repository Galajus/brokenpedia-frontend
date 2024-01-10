import {SkillStatType} from "../skills/skillStatType";
export interface BuildSkillStatData {

  id?: number,
  skillStatType: SkillStatType,
  skillStatId: number,
  buildDetailsId: number | undefined
  level: number
}

import {Skill} from "../skills/skill";
import {Statistic} from "./statistic";
import {SkillCost} from "../skills/skillCost";

export interface InitBuildCalculator {
  classSkills: Skill[];
  defaultStatistics: Statistic[];
  skillCosts: SkillCost[];
}

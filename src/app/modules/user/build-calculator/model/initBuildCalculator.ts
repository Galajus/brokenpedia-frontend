import {Skill} from "./skill";
import {Statistic} from "./statistic";
import {SkillCost} from "./skillCost";

export interface InitBuildCalculator {
  classSkills: Skill[];
  defaultStatistics: Statistic[];
  skillCosts: SkillCost[];
}

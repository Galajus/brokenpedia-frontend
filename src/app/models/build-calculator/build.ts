import {Skill} from "../skills/skill";
import {Statistic} from "./statistic";
export interface Build {
  level: number;
  currentClass: string;
  currentClassSkills: Skill[];
  currentBasicSkills: Skill[];
  currentStatistics: Statistic[];
}

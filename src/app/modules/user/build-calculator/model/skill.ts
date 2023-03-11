import {SkillBasic} from "./skillBasic";

export interface Skill {
  name: string;
  image: string;
  id: number;
  level: number;
  maxLevel: number;
  minLevel: number;
  beginLevel: number;
  profession: string;
  skillBasics: SkillBasic[]
}

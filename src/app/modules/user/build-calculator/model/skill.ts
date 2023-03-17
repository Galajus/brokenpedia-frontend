import {SkillBasic} from "./skillBasic";

export interface Skill {
  id: number;
  name: string;
  image: string;
  level: number;
  maxLevel: number;
  minLevel: number;
  beginLevel: number;
  profession: string;
  skillBasics: SkillBasic[]
}

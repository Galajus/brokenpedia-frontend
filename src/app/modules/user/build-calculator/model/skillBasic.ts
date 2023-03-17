import {SkillPsychoEffect} from "./skillPsychoEffect";
import {SkillCustomEffect} from "./skillCustomEffect";

export interface SkillBasic {
  id: number,
  classSkillId: number,
  skillLevel: number,
  damage: number,
  hitChance: number,
  manaCost: number,
  staminaCost: number,
  roundsTime: number,
  effectRoundsTime: number,
  additionalEffectChance: number,
  specialEffectDescription: string,
  specialEffectValue: number,
  skillDifficulty: string,
  skillPsychoEffects: SkillPsychoEffect[],
  skillCustomEffects: SkillCustomEffect[]
}

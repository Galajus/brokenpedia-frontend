import {PsychoMod} from "../../items/psychoMod";

export interface ModCap {
  mod: PsychoMod,
  value: number
}

const modCaps: ModCap[] = [
  {
    mod: PsychoMod.MANA_DRAIN,
    value: 40
  },
  {
    mod: PsychoMod.DOUBLE_ATTACK_ROLL_CHANCE,
    value: 60
  },
  {
    mod: PsychoMod.DOUBLE_DEFENCE_ROLL_CHANCE,
    value: 80
  },
  {
    mod: PsychoMod.DAMAGE_REDUCTION,
    value: 40
  },
  {
    mod: PsychoMod.CRIT_DAMAGE_REDUCTION,
    value: 60
  },
  {
    mod: PsychoMod.PASSIVE_DAMAGE_REDUCTION,
    value: 80
  },
  {
    mod: PsychoMod.MENTAL_ATTACKS_PENETRATION,
    value: 60
  },
  {
    mod: PsychoMod.HOLM,
    value: 60
  },
  {
    mod: PsychoMod.FARID,
    value: 60
  },
  {
    mod: PsychoMod.EXTRA_ENERGY_DAMAGE,
    value: 60
  },
  {
    mod: PsychoMod.EXTRA_COLD_DAMAGE,
    value: 60
  },
  {
    mod: PsychoMod.EXTRA_FIRE_DAMAGE,
    value: 60
  },
  {
    mod: PsychoMod.CRIT_RESISTANCE,
    value: 60
  },
  {
    mod: PsychoMod.DOUBLE_HIT_CHANCE,
    value: 60
  },
  {
    mod: PsychoMod.CRIT_CHANCE,
    value: 60
  },
  {
    mod: PsychoMod.STAMINA_REGENERATION,
    value: 80
  },
  {
    mod: PsychoMod.MANA_REGENERATION,
    value: 80
  },
  {
    mod: PsychoMod.RESISTANCE_TO_FREEZING,
    value: 80
  },
  {
    mod: PsychoMod.CHANCE_OF_DISENCHANTMENT,
    value: 60
  },
  {
    mod: PsychoMod.MANA_USAGE,
    value: -60
  },
  {
    mod: PsychoMod.STAMINA_USAGE,
    value: -60
  },
  {
    mod: PsychoMod.STUN_AND_INSTA_KILL_RESISTANCE,
    value: 60
  },
  {
    mod: PsychoMod.PERCENTAGE_DAMAGE_REDUCTION,
    value: 60
  }
]

export default modCaps;

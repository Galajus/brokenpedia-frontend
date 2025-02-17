import {PsychoMod} from "@models/items/psychoMod";

export interface SynergeticUpgradeData {
  statsEvenly: number,
  statsMin: number,
  statsMax: number,

  resourcesEvenly: number,
  resourcesMin: number,
  resourcesMax: number,

  resistsEvenly: number,
  resistsMin: number,
  resistsMax: number,

  armorsEvenly: number,
  armorsMin: number,
  armorsMax: number,
}

export enum SyngType {
  STAT = "STAT",
  RES = "RES",
  ARMOR = "ARMOR",
}

export interface SynergeticProgress {
  mergingLevel: number,
  stats: number,
  resources: number,
  resists: number,
  armors: number
}

export interface SyngData {
  level: number,
  value: number,
  rank: number,
  requiredOffenseStat: number,
  requiredAccuracyStat: number,
  suffix: string,
}

const allowedSyngMods: PsychoMod[] = [
  PsychoMod.PHYSICAL_DEFENCE_MODIFIER,
  PsychoMod.RANGE_DEFENCE_MODIFIER,
  PsychoMod.MAGICAL_DEFENCE_MODIFIER,
  PsychoMod.PHYSICAL_HIT_MODIFIER,
  PsychoMod.RANGE_HIT_MODIFIER,
  PsychoMod.MAGICAL_HIT_MODIFIER,
  PsychoMod.STAMINA_USAGE,
  PsychoMod.MANA_USAGE,
  PsychoMod.STAMINA_REGENERATION,
  PsychoMod.MANA_REGENERATION,
  PsychoMod.PHYSICAL_DAMAGE_INCREASE,
  PsychoMod.MAGICAL_DAMAGE_INCREASE,
  PsychoMod.RESISTANCE_TO_ROOT,
  PsychoMod.CRIT_CHANCE,
  PsychoMod.DOUBLE_HIT_CHANCE,
  PsychoMod.FARID,
  PsychoMod.HOLM,
  PsychoMod.CHANCE_OF_DISENCHANTMENT,
  PsychoMod.PASSIVE_DAMAGE_REDUCTION,
  PsychoMod.DOUBLE_DEFENCE_ROLL_CHANCE,
  PsychoMod.DOUBLE_ATTACK_ROLL_CHANCE,
  PsychoMod.CRIT_RESISTANCE
]

const syngData: SyngData[] = [
  {
    level: 20,
    value: 37_500,
    rank: 2,
    requiredOffenseStat: 15,
    requiredAccuracyStat: 15,
    suffix: ""
  },
  {
    level: 30,
    value: 67_500,
    rank: 3,
    requiredOffenseStat: 20,
    requiredAccuracyStat: 20,
    suffix: "Duchów"
  },
  {
    level: 40,
    value: 120_000,
    rank: 4,
    requiredOffenseStat: 30,
    requiredAccuracyStat: 30,
    suffix: "Kłów"
  },
  {
    level: 50,
    value: 220_000,
    rank: 5,
    requiredOffenseStat: 40,
    requiredAccuracyStat: 40,
    suffix: "Szponów"
  },
  {
    level: 60,
    value: 400_000,
    rank: 5,
    requiredOffenseStat: 45,
    requiredAccuracyStat: 45,
    suffix: "Węży"
  },
  {
    level: 70,
    value: 700_000,
    rank: 6,
    requiredOffenseStat: 55,
    requiredAccuracyStat: 55,
    suffix: "Smoków"
  },
  {
    level: 80,
    value: 1_250_000,
    rank: 7,
    requiredOffenseStat: 60,
    requiredAccuracyStat: 60,
    suffix: "Vorlingów"
  },
  {
    level: 90,
    value: 2_250_000,
    rank: 8,
    requiredOffenseStat: 70,
    requiredAccuracyStat: 70,
    suffix: "Lodu"
  },
  {
    level: 100,
    value: 4_000_000,
    rank: 9,
    requiredOffenseStat: 80,
    requiredAccuracyStat: 80,
    suffix: "Dawnych Orków"
  },
  {
    level: 110,
    value: 7_500_000,
    rank: 10,
    requiredOffenseStat: 85,
    requiredAccuracyStat: 85,
    suffix: "Władców"
  },
  {
    level: 120,
    value: 13_500_000,
    rank: 10,
    requiredOffenseStat: 95,
    requiredAccuracyStat: 95,
    suffix: "Torisa"
  },
  {
    level: 130,
    value: 24_000_000,
    rank: 11,
    requiredOffenseStat: 100,
    requiredAccuracyStat: 100,
    suffix: "Medy"
  },
  {
    level: 140,
    value: 42_500_000,
    rank: 12,
    requiredOffenseStat: 110,
    requiredAccuracyStat: 110,
    suffix: "Venegilda"
  },
]

const statSyngProgress: SynergeticProgress[] = [
  {
    mergingLevel: 2,
    stats: 6,
    resources: 2,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 3,
    stats: 6,
    resources: 2,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 4,
    stats: 6,
    resources: 2,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 5,
    stats: 6,
    resources: 2,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 6,
    stats: 6,
    resources: 2,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 7,
    stats: 6,
    resources: 2,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 8,
    stats: 6,
    resources: 2,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 9,
    stats: 6,
    resources: 2,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 10,
    stats: 9,
    resources: 3,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 11,
    stats: 9,
    resources: 3,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 12,
    stats: 12,
    resources: 4,
    resists: 0,
    armors: 0
  },
  {
    mergingLevel: 13,
    stats: 12,
    resources: 4,
    resists: 0,
    armors: 0
  }
];

const armorSyngProgress: SynergeticProgress[] = [
  {
    mergingLevel: 2,
    stats: 3,
    resources: 3,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 3,
    stats: 3,
    resources: 3,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 4,
    stats: 3,
    resources: 3,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 5,
    stats: 3,
    resources: 3,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 6,
    stats: 3,
    resources: 3,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 7,
    stats: 3,
    resources: 3,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 8,
    stats: 3,
    resources: 3,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 9,
    stats: 3,
    resources: 3,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 10,
    stats: 5,
    resources: 5,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 11,
    stats: 5,
    resources: 5,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 12,
    stats: 7,
    resources: 7,
    resists: 0,
    armors: 6
  },
  {
    mergingLevel: 13,
    stats: 7,
    resources: 7,
    resists: 0,
    armors: 6
  }
];

const resSyngProgress: SynergeticProgress[] = [
  {
    mergingLevel: 2,
    stats: 0,
    resources: 3,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 3,
    stats: 0,
    resources: 3,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 4,
    stats: 0,
    resources: 3,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 5,
    stats: 0,
    resources: 3,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 6,
    stats: 0,
    resources: 3,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 7,
    stats: 0,
    resources: 3,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 8,
    stats: 0,
    resources: 3,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 9,
    stats: 0,
    resources: 3,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 10,
    stats: 0,
    resources: 5,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 11,
    stats: 0,
    resources: 5,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 12,
    stats: 0,
    resources: 7,
    resists: 16,
    armors: 0
  },
  {
    mergingLevel: 13,
    stats: 0,
    resources: 7,
    resists: 16,
    armors: 0
  }
];

export { statSyngProgress, armorSyngProgress, resSyngProgress, syngData, allowedSyngMods };

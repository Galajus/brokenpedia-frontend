import {Component, OnInit} from '@angular/core';
import {Orb} from "../../../common/model/orb/orb";
import {OrbType} from "../../../common/model/orb/orbType";
import {OrbCalculations} from "./model/orbCalculations";
import {round} from "lodash-es";

@Component({
  selector: 'app-orbs-table',
  templateUrl: './orbs-table.component.html',
  styleUrls: ['./orbs-table.component.scss']
})
export class OrbsTableComponent implements OnInit {

  protected readonly OrbType = OrbType;
  protected readonly Math = Math;

  ornaments: number = 1;
  calculations: OrbCalculations[] = [];
    displayedColumns: string[] = [
        "effect",
        "type",
        "s1",
        "b1",
        "b2",
        "b3",
        "m1",
        "m2",
        "m3",
        "a1",
        "a2",
        "a3"
    ];

  orbs: Orb[] = [
    {
      effect: "FAST_RESTING",
      type: OrbType.UNIVERSAL,
      startBonus: 0.1
    },
    {
      effect: "SLOWER_GEAR_DISCHARGING",
      type: OrbType.UNIVERSAL,
      startBonus: 0.1
    },
    {
      effect: "BONUS_EXP",
      type: OrbType.UNIVERSAL,
      startBonus: 0.05
    },
    {
      effect: "BONUS_GOLD",
      type: OrbType.UNIVERSAL,
      startBonus: 0.05
    },
    {
      effect: "BONUS_PSYCHOEXP",
      type: OrbType.UNIVERSAL,
      startBonus: 0.05
    },
    {
      effect: "BACKPACK_CAPACITY",
      type: OrbType.UNIVERSAL,
      startBonus: 50
    },
    {
      effect: "CHANCE_TO_DODGE",
      type: OrbType.DEFENSIVE,
      startBonus: 0.1
    },
    {
      effect: "REDUCE_MELEE_DAMAGE",
      type: OrbType.DEFENSIVE,
      startBonus: 0.03
    },
    {
      effect: "REDUCE_RANGED_DAMAGE",
      type: OrbType.DEFENSIVE,
      startBonus: 0.03
    },
    {
      effect: "REDUCE_MENTAL_DAMAGE",
      type: OrbType.DEFENSIVE,
      startBonus: 0.03
    },
    {
      effect: "REDUCE_AOE_DAMAGE",
      type: OrbType.DEFENSIVE,
      startBonus: 0.03
    },
    {
      effect: "REDUCE_NORMAL_MOBS_DAMAGE",
      type: OrbType.DEFENSIVE,
      startBonus: 0.03
    },
    {
      effect: "REDUCE_CHAMPION_DAMAGE",
      type: OrbType.DEFENSIVE,
      startBonus: 0.03
    },
    {
      effect: "REDUCE_BOSS_DAMAGE",
      type: OrbType.DEFENSIVE,
      startBonus: 0.03
    },
    {
      effect: "CHANCE_DRAIN_HP",
      type: OrbType.OFFENSIVE,
      startBonus: 0.1
    },
    {
      effect: "CHANCE_DRAIN_MANA",
      type: OrbType.OFFENSIVE,
      startBonus: 0.1
    },
    {
      effect: "CHANCE_DRAIN_STAMINA",
      type: OrbType.OFFENSIVE,
      startBonus: 0.1
    },
    {
      effect: "DAMAGE_WHEN_CRITICAL_INJURED",
      type: OrbType.OFFENSIVE,
      startBonus: 0.1
    },
    {
      effect: "CHANCE_PENETRATE_HOLM",
      type: OrbType.OFFENSIVE,
      startBonus: 0.1
    },
    {
      effect: "CHANCE_PENETRATE_FARID",
      type: OrbType.OFFENSIVE,
      startBonus: 0.1
    },
    {
      effect: "DAMAGE_VS_NORMAL_MOBS",
      type: OrbType.OFFENSIVE,
      startBonus: 0.05
    },
    {
      effect: "DAMAGE_VS_CHAMPIONS",
      type: OrbType.OFFENSIVE,
      startBonus: 0.05
    },
    {
      effect: "DAMAGE_VS_BOSSES",
      type: OrbType.OFFENSIVE,
      startBonus: 0.05
    },
    {
      effect: "INCREASE_HIT_CHANCE_ON_MISSING",
      type: OrbType.OFFENSIVE,
      startBonus: 0.03
    },
    {
      effect: "MORE_POWERFUL_CRIT_CHANCE",
      type: OrbType.OFFENSIVE,
      startBonus: 0.05
    },
  ]

  constructor() { }

  ngOnInit(): void {
    this.doCalculations();
  }

  doCalculations() {
    this.calculations = [];
    let incrustationBooster = this.getIncrustationBooster();
    this.orbs.forEach(o => {
      this.calculations.push({
          orb: o,
          s1: round((o.startBonus * (1 + this.getOrbTierBooster("s1") + incrustationBooster)) * 100, 2),
          b1: round((o.startBonus * (1 + this.getOrbTierBooster("b1") + incrustationBooster)) * 100, 2),
          b2: round((o.startBonus * (1 + this.getOrbTierBooster("b2") + incrustationBooster)) * 100, 2),
          b3: round((o.startBonus * (1 + this.getOrbTierBooster("b3") + incrustationBooster)) * 100, 2),
          m1: round((o.startBonus * (1 + this.getOrbTierBooster("m1") + incrustationBooster)) * 100, 2),
          m2: round((o.startBonus * (1 + this.getOrbTierBooster("m2") + incrustationBooster)) * 100, 2),
          m3: round((o.startBonus * (1 + this.getOrbTierBooster("m3") + incrustationBooster)) * 100, 2),
          a1: round((o.startBonus * (1 + this.getOrbTierBooster("a1") + incrustationBooster)) * 100, 2),
          a2: round((o.startBonus * (1 + this.getOrbTierBooster("a2") + incrustationBooster)) * 100, 2),
          a3: round((o.startBonus * (1 + this.getOrbTierBooster("a3") + incrustationBooster)) * 100, 2)
      } as OrbCalculations)
    })
  }

  getOrbTierBooster(tier: string) {
    switch (tier) {
        case "s1": return 0;
        case "b1": return 0.3;
        case "b2": return 0.36;
        case "b3": return 0.45;
        case "m1": return 0.7;
        case "m2": return 0.84;
        case "m3": return 1.05;
        case "a1": return 1.5;
        case "a2": return 1.8;
        case "a3": return 2.25;
        default: return 0;
    }
  }

  getIncrustationBooster() {
    switch (this.ornaments) {
        case 1: return 0;
        case 4: return 0.05;
        case 5: return 0.1;
        case 6: return 0.2;
        case 7: return 0.3;
        case 8: return 0.5;
        case 9: return 0.75;
        default: return 0;
    }
  }
}

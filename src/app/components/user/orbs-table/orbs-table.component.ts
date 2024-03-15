import {Component, OnInit} from '@angular/core';
import {OrbCalculations} from "@models/orb/orbCalculations";
import {round} from "lodash-es";
import {OrbType} from "@models/orb/orbType";
import {Orb} from "@models/orb/orb";
import {OrbService} from "@services/user/orb/orb.service";

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
        "name",
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

  orbs: Orb[] = [];

  constructor(private orbService: OrbService) { }

  ngOnInit(): void {
    this.loadOrbs();
  }

  loadOrbs() {
    this.orbService.getAllOrbs()
      .subscribe({
        next: orbs => {
          this.orbs = orbs;
          this.doCalculations();
        }
      })
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

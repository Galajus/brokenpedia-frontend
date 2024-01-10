import {Component, Inject, OnInit} from '@angular/core';
import {DrifItem} from "@models/drif/drifItem";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {round} from "lodash-es";
import {PsychoMod} from "@models/items/psychoMod";

@Component({
  selector: 'app-drif-select',
  templateUrl: './drif-select.component.html',
  styleUrls: ['./drif-select.component.scss']
})
export class DrifSelectComponent implements OnInit {

  protected readonly drifs = drifs;
  protected readonly PsychoMod = PsychoMod;
  protected readonly Object = Object;

  drifTier: number = 1;
  leftPower: number = 0;
  drifLevel: number = 0;
  rarRank: number = 1;
  drifSlot: number = 1;
  itemSlot: string = "";
  constructor(
    private dialogRef: MatDialogRef<DrifSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    this.leftPower = data.leftPower;
    this.drifTier = data.drifTier;
    this.rarRank = data.rarRank;
    this.drifSlot = data.drifSlot;
    this.itemSlot = data.itemSlot;
    this.drifLevel = data.drifLevel;
  }

  ngOnInit(): void {
    this.dialogRef.backdropClick()
      .subscribe(e => this.updateLevel());
  }

  getPsychoModByString(mod: string) {
    return (<any>PsychoMod)[mod];
  }

  getReduction(): DrifItem[] {
    return drifs.filter(d => d.category === "REDUCTION");
  }
  getDamage(): DrifItem[] {
    return drifs.filter(d => d.category === "DAMAGE");
  }
  getSpecial(): DrifItem[] {
    return drifs.filter(d => d.category === "SPECIAL");
  }
  getDefence(): DrifItem[] {
    return drifs.filter(d => d.category === "DEFENCE");
  }
  getAccuracy(): DrifItem[] {
    return drifs.filter(d => d.category === "ACCURACY");
  }

  setTier(number: number) {
    this.drifTier = number;
  }

  close(drif: DrifItem) {
    drif.tier = this.drifTier;
    if (this.drifLevel === 0) {
      this.drifLevel = 1;
    }
    drif.level = this.drifLevel;
    this.dialogRef.close({drif: drif});
  }

  updateLevel() {
    if (this.drifLevel > 0) {
      this.dialogRef.close({newLevel: this.drifLevel, newTier: this.drifTier});
    }
  }

  removeMod() {
    this.dialogRef.close({removeMod: true});
  }

  getDrifPower(startPower: number) {
    return startPower * this.getDrifPowerBooster();
  }

  getDrifPowerBooster() {
    let booster = round((this.drifLevel + 1)/ 5, 0);
    if (booster === 0) {
      return 1;
    }
    return booster;
  }

  protected readonly Number = Number;
}

const drifs: DrifItem[] = [
  {
    tier: 1,
    level: 1,
    startPower: 4,
    psychoGrowByLevel: 0.5,
    psychoMod: "DAMAGE_REDUCTION",
    category: "REDUCTION",
    shortName: "alorn"

  },
  {
    tier: 1,
    level: 1,
    startPower: 4,
    psychoGrowByLevel: 0.5,
    psychoMod: "CRIT_CHANCE",
    category: "DAMAGE",
    shortName: "band"
  },
  {
    tier: 1,
    level: 1,
    startPower: 4,
    psychoGrowByLevel: 0.5,
    psychoMod: "DOUBLE_HIT_CHANCE",
    category: "DAMAGE",
    shortName: "teld"
  },
  {
    tier: 1,
    level: 1,
    startPower: 4,
    psychoGrowByLevel: 0.5,
    psychoMod: "FARID",
    category: "REDUCTION",
    shortName: "farid"
  },

  //--------------- POWER 3

  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 0.5,
    psychoMod: "EXTRA_FIRE_DAMAGE",
    category: "DAMAGE",
    shortName: "unn"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 0.5,
    psychoMod: "EXTRA_COLD_DAMAGE",
    category: "DAMAGE",
    shortName: "kalh"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 0.5,
    psychoMod: "EXTRA_ENERGY_DAMAGE",
    category: "DAMAGE",
    shortName: "val"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 0.5,
    psychoMod: "PHYSICAL_DAMAGE_INCREASE",
    category: "DAMAGE",
    shortName: "astah"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 0.5,
    psychoMod: "MAGICAL_DAMAGE_INCREASE",
    category: "DAMAGE",
    shortName: "abaf"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 0.5,
    psychoMod: "HOLM",
    category: "REDUCTION",
    shortName: "holm"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 0.5,
    psychoMod: "CHANCE_OF_DISENCHANTMENT",
    category: "SPECIAL",
    shortName: "verd"
  },


  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 1,
    psychoMod: "MAGICAL_HIT_MODIFIER",
    category: "ACCURACY",
    shortName: "oda"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 1,
    psychoMod: "RANGE_HIT_MODIFIER",
    category: "ACCURACY",
    shortName: "ling"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 1,
    psychoMod: "PHYSICAL_HIT_MODIFIER",
    category: "ACCURACY",
    shortName: "ulk"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 1,
    psychoMod: "PASSIVE_DAMAGE_REDUCTION",
    category: "REDUCTION",
    shortName: "iori"
  },
  {
    tier: 1,
    level: 1,
    startPower: 3,
    psychoGrowByLevel: 2,
    psychoMod: "CRIT_DAMAGE_REDUCTION",
    category: "REDUCTION",
    shortName: "faln"
  },

  //--------------- POWER 2

  {
    tier: 1,
    level: 1,
    startPower: 2,
    psychoGrowByLevel: -1,
    psychoMod: "MANA_USAGE",
    category: "SPECIAL",
    shortName: "von"
  },
  {
    tier: 1,
    level: 1,
    startPower: 2,
    psychoGrowByLevel: -1,
    psychoMod: "STAMINA_USAGE",
    category: "SPECIAL",
    shortName: "amad"
  },


  {
    tier: 1,
    level: 1,
    startPower: 2,
    psychoGrowByLevel: 0.15,
    psychoMod: "MANA_REGENERATION",
    category: "SPECIAL",
    shortName: "ann"
  },
  {
    tier: 1,
    level: 1,
    startPower: 2,
    psychoGrowByLevel: 0.15,
    psychoMod: "STAMINA_REGENERATION",
    category: "SPECIAL",
    shortName: "eras"
  },


  {
    tier: 1,
    level: 1,
    startPower: 2,
    psychoGrowByLevel: 0.5,
    psychoMod: "DOUBLE_ATTACK_ROLL_CHANCE",
    category: "ACCURACY",
    shortName: "dur"
  },


  {
    tier: 1,
    level: 1,
    startPower: 2,
    psychoGrowByLevel: 1,
    psychoMod: "MENTAL_ATTACKS_PENETRATION",
    category: "ACCURACY",
    shortName: "lorb"
  },
  {
    tier: 1,
    level: 1,
    startPower: 2,
    psychoGrowByLevel: 1,
    psychoMod: "DOUBLE_DEFENCE_ROLL_CHANCE",
    category: "DEFENCE",
    shortName: "elen"
  },
  {
    tier: 1,
    level: 1,
    startPower: 2,
    psychoGrowByLevel: 0.5,
    psychoMod: "CRIT_RESISTANCE",
    category: "DEFENCE",
    shortName: "grod"
  },

  //--------------- POWER 1

  {
    tier: 1,
    level: 1,
    startPower: 1,
    psychoGrowByLevel: 1,
    psychoMod: "MAGICAL_DEFENCE_MODIFIER",
    category: "DEFENCE",
    shortName: "grud"
  },
  {
    tier: 1,
    level: 1,
    startPower: 1,
    psychoGrowByLevel: 1,
    psychoMod: "RANGE_DEFENCE_MODIFIER",
    category: "DEFENCE",
    shortName: "tovi"
  },
  {
    tier: 1,
    level: 1,
    startPower: 1,
    psychoGrowByLevel: 1,
    psychoMod: "PHYSICAL_DEFENCE_MODIFIER",
    category: "DEFENCE",
    shortName: "tall"
  },
  {
    tier: 1,
    level: 1,
    startPower: 1,
    psychoGrowByLevel: 0.5,
    psychoMod: "RESISTANCE_TO_ROOT",
    category: "SPECIAL",
    shortName: "heb"
  },
  {
    tier: 1,
    level: 1,
    startPower: 1,
    psychoGrowByLevel: 1,
    psychoMod: "RESISTANCE_TO_FREEZING",
    category: "SPECIAL",
    shortName: "adrim"
  }
]


import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {round} from "lodash-es";
import {PsychoMod} from "@models/items/psychoMod";
import {DrifCategory} from "@models/drif/drifCategory";
import {Drif} from "@models/drif/drif";

@Component({
  selector: 'app-drif-select',
  templateUrl: './drif-select.component.html',
  styleUrls: ['./drif-select.component.scss']
})
export class DrifSelectComponent implements OnInit {

  protected readonly PsychoMod = PsychoMod;
  protected readonly Object = Object;

  drifs: Drif[];
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

    this.drifs = data.drifs;
  }

  ngOnInit(): void {
    this.dialogRef.backdropClick()
      .subscribe(e => this.updateLevel());
  }

  getPsychoModByString(mod: string) {
    return (<any>PsychoMod)[mod];
  }

  getReduction(): Drif[] {
    return this.drifs.filter(d => d.category === DrifCategory.REDUCTION);
  }
  getDamage(): Drif[] {
    return this.drifs.filter(d => d.category === DrifCategory.DAMAGE);
  }
  getSpecial(): Drif[] {
    return this.drifs.filter(d => d.category === DrifCategory.SPECIAL);
  }
  getDefence(): Drif[] {
    return this.drifs.filter(d => d.category === DrifCategory.DEFENCE);
  }
  getAccuracy(): Drif[] {
    return this.drifs.filter(d => d.category === DrifCategory.ACCURACY);
  }

  setTier(number: number) {
    this.drifTier = number;
  }

  close(drif: Drif) {
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


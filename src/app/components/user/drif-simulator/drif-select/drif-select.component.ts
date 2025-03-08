import {Component, Inject, OnInit} from '@angular/core';
import {cloneDeep, round} from "lodash-es";
import {PsychoMod} from "@models/items/psychoMod";
import {DrifCategory} from "@models/drif/drifCategory";
import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from "@angular/material/tooltip";

const localTooltipOptions: MatTooltipDefaultOptions = {
  hideDelay: 0, showDelay: 0, touchendHideDelay: 0,
  disableTooltipInteractivity: true
};

@Component({
    selector: 'app-drif-select',
    templateUrl: './drif-select.component.html',
    styleUrls: ['./drif-select.component.scss'],
    standalone: false,
    providers: [
      {provide: MAT_TOOLTIP_DEFAULT_OPTIONS,useValue: localTooltipOptions},
    ]
})
export class DrifSelectComponent implements OnInit {

  protected readonly PsychoMod = PsychoMod;
  protected readonly Object = Object;

  drifs: Drif[];
  drifTier: number = 1;
  leftPower: number = 0;
  drifLevel: number = 1;
  rarRank: number = 1;
  drifSlot: number = 1;
  itemSlot: string = "";
  lastUsedTier: number = 1;
  constructor(
    private dialogRef: MatDialogRef<DrifSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {

    this.leftPower = data.leftPower;
    this.drifTier = data.drifTier;
    this.rarRank = data.rarRank;
    this.drifSlot = data.drifSlot;
    this.itemSlot = data.itemSlot;
    this.drifLevel = data.drifLevel;
    this.lastUsedTier = data.lastUsedTier;
    this.drifs = data.drifs;
  }

  ngOnInit(): void {
    this.dialogRef.backdropClick()
      .subscribe(e => this.updateLevel());
    if (this.drifTier === 0) {
      if (this.lastUsedTier === 4 && this.rarRank >= 10) {
        this.drifTier = this.lastUsedTier;
        return;
      }
      if (this.lastUsedTier === 3 && this.rarRank >= 7) {
        this.drifTier = this.lastUsedTier;
        return;
      }
      if (this.lastUsedTier === 2 && this.rarRank >= 4) {
        this.drifTier = this.lastUsedTier;
        return;
      }
      this.drifTier = 1;
    }
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
    drif = cloneDeep(drif);
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

  get tierName() {
    switch (this.drifTier) {
      case 1: {
        return "sub";
      }
      case 2: {
        return "bi";
      }
      case 3: {
        return "magni";
      }
      case 4: {
        return "arcy";
      }
      default: {
        return "sub";
      }
    }
  }

  protected readonly Number = Number;
  protected readonly InventorySlot = InventorySlot;
}


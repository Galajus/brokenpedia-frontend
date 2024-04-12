import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {DrifTier} from "@models/drif/drifTier";
import amountReduction from "../../../models/drif/amountDrifReduction";
import {RarCapacity} from "@models/drif/rarCapacity";
import {RarWithDrifs} from "@models/drif/rarWithDrifs";
import {MatDialog} from "@angular/material/dialog";
import {DrifSelectComponent} from "./drif-select/drif-select.component";
import {ModSummary} from "@models/drif/modSummary";
import modCaps from "../../../models/drif/modCap";
import {EpikItem} from "@models/drif/epikItem";
import {UserRarsWithDrifs} from "@models/drif/userRarsWithDrifs";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {DragDrifItem} from "@models/drif/dragDrifItem";
import {clone, cloneDeep} from "lodash-es";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PsychoMod} from "@models/items/psychoMod";
import {TranslateService} from "@ngx-translate/core";
import {DrifService} from "@services/user/drif/drif.service";
import {DrifCategory} from "@models/drif/drifCategory";
import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";

@Component({
  selector: 'app-drif-simulator',
  templateUrl: './drif-simulator.component.html',
  styleUrls: ['./drif-simulator.component.scss']
})
export class DrifSimulatorComponent implements OnInit, OnDestroy {

  protected readonly Number = Number;
  protected readonly DrifCategory = DrifCategory;

  modSummary: ModSummary[] = [];
  illuminatedMod: string = "";
  activeBuild: string = "temp";
  buildToClone: string = "";
  drifs: Drif[] = [];
  buildNames: string[] = [ "temp", "build 1", "build 2", "build 3", "build 4", "build 5", "build 6", "build 7", "build 8", "build 9"]
  userRarsWithDrifs: UserRarsWithDrifs[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    protected drifService: DrifService
  ) {
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.generateUserRarsWithDrifs();
    this.fillUserRars();
    this.drifService.getAllDrifs()
      .subscribe(d => {
        this.drifs = d;
        this.load();
      });
  }

  ngOnDestroy() {
    this.saveBuild(this.activeBuild);
  }

  fillUserRars() {
    this.userRarsWithDrifs.forEach(rars => rars.rarsWithDrifs = this.generateRarsWithDrifsTemplate());
  }

  resetBuild(name: string) {
    let userRarsWithDrifs = this.userRarsWithDrifs.find(userRars => userRars.name === name);
    if (userRarsWithDrifs) {
      userRarsWithDrifs.rarsWithDrifs = this.generateRarsWithDrifsTemplate();
      this.calculateModSummary();
    }
  }

  generateRarsWithDrifsTemplate() {
    let rarsWithDrifsTemplate: RarWithDrifs[] = [];
    const slotKeys = Object.keys(InventorySlot)  as (keyof typeof InventorySlot)[];
    slotKeys.forEach(k => {
      rarsWithDrifsTemplate.push({
        slot: InventorySlot[k],
        rank: 2,
        ornaments: 1,
        sidragaBoost: false,
        drifItem1: null,
        drifItem2: null,
        drifItem3: null
      })
    })
    return rarsWithDrifsTemplate;
  }

  generateUserRarsWithDrifs() {
    this.buildNames.forEach(n => {
      this.userRarsWithDrifs.push({
        name: n,
        rarsWithDrifs: []
      })
    })
  }

  getActiveBuild() {
    let find = this.userRarsWithDrifs.find(rars => rars.name === this.activeBuild);
    if (!find) {
      throw "NOT FOUND ACTIVE BUILD";
    }
    return find;
  }

  setActiveBuild(name: string) {
    this.saveBuild(this.activeBuild);
    this.activeBuild = name;
    this.calculateModSummary();
  }

  openDrifDialog(rarWithDrifs: RarWithDrifs, drifSlot: number): void {
    const dialogRef = this.dialog.open(DrifSelectComponent, {
      width: '1000px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        leftPower: this.getLeftPower(rarWithDrifs.slot, drifSlot),
        rarRank: rarWithDrifs.rank,
        drifSlot: drifSlot,
        drifTier: this.getDrifTier(rarWithDrifs, drifSlot),
        drifLevel: this.getDrifLevel(rarWithDrifs, drifSlot),
        itemSlot: rarWithDrifs.slot,
        drifs: this.drifs
      }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          if (data.newLevel) {
            this.changeModLevelAnItem(rarWithDrifs, drifSlot, data.newLevel, data.newTier);
            this.calculateModSummary();
            this.saveBuild(this.activeBuild);
            return;
          }
          if (data.removeMod) {
            this.removeModFromItem(rarWithDrifs, drifSlot);
            this.calculateModSummary();
            this.saveBuild(this.activeBuild);
            return;
          }
          this.assignDrifToItem(data.drif, rarWithDrifs, drifSlot);
          this.calculateModSummary();
          this.saveBuild(this.activeBuild);
        }
      }
    );
  }

  removeModFromItem(rarWithDrifs: RarWithDrifs, drifSlot: number){
    switch (drifSlot) {
      case 1: {
        rarWithDrifs.drifItem1 = null;
        break;
      }
      case 2: {
        rarWithDrifs.drifItem2 = null;
        break;
      }
      case 3: {
        rarWithDrifs.drifItem3 = null;
        break;
      }
    }
  }

  changeModLevelAnItem(rarWithDrifs: RarWithDrifs, drifSlot: number, level: number, tier: number) {
    switch (drifSlot) {
      case 1: {
        if (rarWithDrifs.drifItem1) {
          let oldLevel = clone(rarWithDrifs.drifItem1.level);
          let oldTier = clone(rarWithDrifs.drifItem1.tier);
          rarWithDrifs.drifItem1.level = level;
          rarWithDrifs.drifItem1.tier = tier;
          if (this.countUsedPower(rarWithDrifs) > this.getPowerCapacityByRank(rarWithDrifs)) {
            rarWithDrifs.drifItem1.level = oldLevel;
            rarWithDrifs.drifItem1.tier = oldTier;
          }
        }
        break;
      }
      case 2: {
        if (rarWithDrifs.drifItem2) {
          let oldLevel = clone(rarWithDrifs.drifItem2.level);
          let oldTier = clone(rarWithDrifs.drifItem2.tier);
          rarWithDrifs.drifItem2.level = level;
          rarWithDrifs.drifItem2.tier = tier;
          if (this.countUsedPower(rarWithDrifs) > this.getPowerCapacityByRank(rarWithDrifs)) {
            rarWithDrifs.drifItem2.level = oldLevel;
            rarWithDrifs.drifItem2.tier = oldTier;
          }
        }
        break;
      }
      case 3: {
        if (rarWithDrifs.drifItem3) {
          let oldLevel = clone(rarWithDrifs.drifItem3.level);
          let oldTier = clone(rarWithDrifs.drifItem3.tier);
          rarWithDrifs.drifItem3.level = level;
          rarWithDrifs.drifItem3.tier = tier;
          if (this.countUsedPower(rarWithDrifs) > this.getPowerCapacityByRank(rarWithDrifs)) {
            rarWithDrifs.drifItem3.level = oldLevel;
            rarWithDrifs.drifItem3.tier = oldTier;
          }
        }
        break;
      }
    }
  }

  calculateModSummary() {
    this.validateRanks();
    this.validateLevels();
    this.modSummary = [];
    let activeBuild = this.getActiveBuild();
    activeBuild.rarsWithDrifs.forEach(rar => {
      if (rar.rank > 12) {
        this.calculateEpicMod(rar.rank, rar.ornaments);
        return;
      }
      if (rar.drifItem1) {
        this.countMod(rar.drifItem1, rar.ornaments, rar.sidragaBoost);
      }
      if (rar.drifItem2 && (rar.rank >= 4 || rar.ornaments >= 7)) {
        this.countMod(rar.drifItem2, rar.ornaments, rar.sidragaBoost);
      }
      if (rar.drifItem3 && rar.rank >= 10) {
        this.countMod(rar.drifItem3, rar.ornaments, rar.sidragaBoost);
      }
    });

    this.calculateRealModSum();
  }

  private validateLevels() {
    this.getActiveBuild().rarsWithDrifs.forEach(rar => {
      let drifMaxLevel1 = this.getDrifMaxLevel(rar.drifItem1);
      let drifMaxLevel2 = this.getDrifMaxLevel(rar.drifItem2);
      let drifMaxLevel3 = this.getDrifMaxLevel(rar.drifItem3);
      if (rar.drifItem1 && this.getDrifLevel(rar, 1) > drifMaxLevel1) {
        rar.drifItem1.level = drifMaxLevel1;
      }
      if (rar.drifItem2 && this.getDrifLevel(rar, 2) > drifMaxLevel2) {
        rar.drifItem2.level = drifMaxLevel2;
      }
      if (rar.drifItem3 && this.getDrifLevel(rar, 3) > drifMaxLevel3) {
        rar.drifItem3.level = drifMaxLevel3;
      }
    })
  }

  private validateRanks() {
    this.getActiveBuild().rarsWithDrifs.forEach(rar => {
      if (rar.rank < 10) {
        rar.drifItem3 = null;
      }
      if (rar.rank < 4 && rar.ornaments < 7) {
        rar.drifItem2 = null;
      }
    })
  }

  private getDrifMaxLevel(drif: Drif | null): number {
    if (!drif) {
      return 0;
    }
    let find = drifTiers.find(dt => {
      return dt.tier === drif.tier;
    });
    if (find) {
      return find.maxDrifLevel;
    }
    return 0;
  }

  calculateEpicMod(rank: number, ornaments: number) {
    let epikItem = epikItems.find(it => it.indexNumber === rank);
    if (!epikItem) {
      throw new Error("Epic item not found");
    }

    // @ts-ignore
    let dedicatedDrifItem = this.drifs.find(drif => drif.psychoMod === epikItem?.psychoModDedicated);
    // @ts-ignore
    let critDrifItem = this.drifs.find(drif => drif.psychoMod === epikItem?.psychoModCrit);

    if (!dedicatedDrifItem || !critDrifItem) {
      throw new Error("epic mods unknown");
    }

    //DEDICATED
    let dedicatedEpicModLevel = this.getActiveBuild().dedicatedEpicModLevel;
    if (!dedicatedEpicModLevel) {
      dedicatedEpicModLevel = 16;
      this.getActiveBuild().dedicatedEpicModLevel = 16;
    }
    let modSum = dedicatedEpicModLevel * dedicatedDrifItem?.psychoGrowByLevel;
    modSum += dedicatedDrifItem.psychoGrowByLevel * 3; //tier 3 of Epic + update +1
    if (ornaments < 7) {
      modSum = modSum * epikItem.booster;
    }
    if (ornaments === 7) {
      modSum = modSum * (0.03 + epikItem.booster);
    }
    if (ornaments === 8) {
      modSum = modSum * (0.08 + epikItem.booster);
    }
    if (ornaments === 9) {
      modSum = modSum * (0.15 + epikItem.booster);
    }
    let modCap = modCaps.find(capped => capped.mod === dedicatedDrifItem?.psychoMod);
    this.modSummary.push({
      mod: epikItem?.psychoModDedicated,
      drifName: dedicatedDrifItem.shortName,
      modSum: modSum,
      amountDrifs: 1,
      category: dedicatedDrifItem.category,
      max: modCap?.value
    })
    //CRIT
    let critEpicModLevel = this.getActiveBuild().critEpicModLevel;
    if (!critEpicModLevel) {
      critEpicModLevel = 16;
      this.getActiveBuild().critEpicModLevel = 16;
    }
    let modSumCrit = critEpicModLevel * critDrifItem?.psychoGrowByLevel;
    modSumCrit += critDrifItem.psychoGrowByLevel * 3; //tier 3 of Epic + update +1
    if (ornaments < 7) {
      modSumCrit = modSumCrit * epikItem.booster;
    }
    if (ornaments === 7) {
      modSumCrit = modSumCrit * (0.03 + epikItem.booster);
    }
    if (ornaments === 8) {
      modSumCrit = modSumCrit * (0.08 + epikItem.booster);
    }
    if (ornaments === 9) {
      modSumCrit = modSumCrit * (0.15 + epikItem.booster);
    }
    let modCapCrit = modCaps.find(capped => capped.mod === critDrifItem?.psychoMod);
    this.modSummary.push({
      mod: epikItem?.psychoModCrit,
      drifName: critDrifItem.shortName,
      modSum: modSumCrit,
      amountDrifs: 1,
      category: critDrifItem.category,
      max: modCapCrit?.value
    })
    //EXTRA AP
    this.modSummary.push({
      mod: PsychoMod.EXTRA_AP,
      drifName: "?",
      modSum: 1,
      amountDrifs: 1,
      category: DrifCategory.SPECIAL
    })
  }

  countMod(drif: Drif, ornaments: number, sidragaBoost: boolean) {
    const drifTier = drifTiers.filter(drifTier => drifTier.tier === drif.tier)[0];
    const psychoMod = drif.psychoMod;
    const drifLevel = drif?.level || 1;
    const currentDrifTier = drif.tier || 1;
    let modSummary = this.modSummary.find(modSum => modSum.mod === psychoMod);
    if (modSummary) {
      let toAdd = 0;
      toAdd += drifLevel * drif.psychoGrowByLevel;
      toAdd += drif.psychoGrowByLevel * (currentDrifTier - 1);
      if (currentDrifTier === 3) {
        toAdd += drif.psychoGrowByLevel;
      }
      if (currentDrifTier === 4) {
        toAdd += drif.psychoGrowByLevel * 2;
      }
      modSummary.amountDrifs++;
      //modSummary.modSum += drifLevel * drif.psychoGrowByLevel;
      //modSummary.modSum += drif.psychoGrowByLevel * (currentDrifTier - 1);
      if (drifTier.tier === 4 && drifLevel >= 19) {
        //modSummary.modSum += (drifLevel - 18) * drif.psychoGrowByLevel;
        toAdd += (drifLevel - 18) * drif.psychoGrowByLevel;
      }
      let specialBoost = this.countSpecialBoost(sidragaBoost, ornaments);
      toAdd = toAdd * specialBoost;
      modSummary.modSum += toAdd;
    } else {
      let value = drifLevel * drif.psychoGrowByLevel;
      value += drif.psychoGrowByLevel * (currentDrifTier - 1);
      if (drifTier.tier === 4 && drifLevel >= 19) {
        value += (drifLevel - 18) * drif.psychoGrowByLevel;
      }
      if (currentDrifTier === 3) {
        value += drif.psychoGrowByLevel;
      }
      if (currentDrifTier === 4) {
        value += drif.psychoGrowByLevel * 2;
      }
      let specialBoost = this.countSpecialBoost(sidragaBoost, ornaments);
      value = value * specialBoost;
      let modCap = modCaps.find(capped => capped.mod === psychoMod);
      this.modSummary.push({
        mod: psychoMod,
        drifName: drif.shortName,
        modSum: value,
        amountDrifs: 1,
        category: drif.category,
        max: modCap?.value
      })
    }
  }

  countSpecialBoost(sidragaBoost: boolean, ornaments: number) {
    let specialBoost = 1;
    if (sidragaBoost) {
      specialBoost += 0.15;
    }
    if (ornaments === 7) {
      specialBoost += 0.03;
    }
    if (ornaments === 8) {
      specialBoost += 0.08;
    }
    if (ornaments === 9) {
      specialBoost += 0.15;
    }
    return specialBoost;
  }

  private calculateRealModSum() {
    this.modSummary.forEach(modSum => {
      if (modSum.amountDrifs > 3) {
        let amountDrifReduction = amountReduction.find(red => red.amount === modSum.amountDrifs);
        if (amountDrifReduction) {
          let oldSum = cloneDeep(modSum.modSum);
          modSum.modSum = modSum.modSum * amountDrifReduction.efektSum;
          modSum.reducedValue = oldSum - modSum.modSum;
          modSum.reducedPercent = amountDrifReduction.efektSum * 100;
        }
      }
    })
  }

  private getDrifTier(rarWithDrifs: RarWithDrifs, drifSlot: number): number {
    switch (drifSlot) {
      case 1: {
        if (rarWithDrifs.drifItem1) {
          return rarWithDrifs.drifItem1.tier  || 1;
        }
        break;
      }
      case 2: {
        if (rarWithDrifs.drifItem2) {
          return rarWithDrifs.drifItem2.tier  || 1;
        }
        break;
      }
      case 3: {
        if (rarWithDrifs.drifItem3) {
          return rarWithDrifs.drifItem3.tier  || 1;
        }
        break;
      }
    }
    return 1;
  }

  private getDrifLevel(rarWithDrifs: RarWithDrifs, drifSlot: number): number {
    if (drifSlot === 1) {
      return rarWithDrifs?.drifItem1?.level || 0;
    }
    if (drifSlot === 2) {
      return rarWithDrifs?.drifItem2?.level || 0;
    }
    if (drifSlot === 3) {
      return rarWithDrifs?.drifItem3?.level || 0;
    }
    return 0;
  }

  countUsedPower(eq: RarWithDrifs) {
    return this.drifService.countUsedPower(eq.drifItem1, eq.drifItem2, eq.drifItem3, eq.ornaments, eq.rank)
  }

  private assignDrifToItem(drif: Drif, rarWithDrifs: RarWithDrifs, slot: number) {

    switch (slot) {
      case 1: {
        if (rarWithDrifs.drifItem2?.psychoMod !== drif.psychoMod && rarWithDrifs.drifItem3?.psychoMod !== drif.psychoMod) {
          rarWithDrifs.drifItem1 = this.cloneDrif(drif);
          break;
        }
        console.log("MOD EXIST ON ITEM: " + drif.psychoMod);
        break;
      }
      case 2: {
        if (rarWithDrifs.drifItem1?.psychoMod !== drif.psychoMod && rarWithDrifs.drifItem3?.psychoMod !== drif.psychoMod) {
          rarWithDrifs.drifItem2 = this.cloneDrif(drif);
          break;
        }
        console.log("MOD EXIST ON ITEM: " + drif.psychoMod);
        break;
      }
      case 3: {
        if (rarWithDrifs.drifItem1?.psychoMod !== drif.psychoMod && rarWithDrifs.drifItem2?.psychoMod !== drif.psychoMod) {
          rarWithDrifs.drifItem3 = this.cloneDrif(drif);
          break;
        }
        console.log("MOD EXIST ON ITEM: " + drif.psychoMod);
        break;
      }
    }
  }

  cloneDrif(drif: Drif | null) {
    if (!drif) {
      return null;
    }
    return {
      tier: drif.tier,
      level: drif.level,
      startPower: drif.startPower,
      psychoGrowByLevel: drif.psychoGrowByLevel,
      psychoMod: drif.psychoMod,
      category: drif.category,
      shortName: drif.shortName
    } as Drif;
  }

  maximiseDrifLevels() {
    let rars = this.userRarsWithDrifs.find(rars => rars.name === this.activeBuild);
    if (rars) {
      rars.rarsWithDrifs.forEach(rar => {
        let drifItem1 = rar.drifItem1;
        let drifItem2 = rar.drifItem2;
        let drifItem3 = rar.drifItem3;
        if (drifItem1) {
          this.doMaximiseLevel(drifItem1, rar);
        }
        if (drifItem2) {
          this.doMaximiseLevel(drifItem2, rar);
        }
        if (drifItem3) {
          this.doMaximiseLevel(drifItem3, rar);
        }
      });
      rars.critEpicModLevel = 16;
      rars.dedicatedEpicModLevel = 16;
      this.calculateModSummary();
    }
  }

  private doMaximiseLevel(drif: Drif, rar: RarWithDrifs) {
    let tier = drifTiers.find(drifTier => drifTier.tier === drif.tier);
    if (!tier) {
      console.log("FATAL ERROR: Tier not found")
      return;
    }
    let oldLevel = clone(drif.level);
    drif.level = tier.maxDrifLevel;
    if (this.countUsedPower(rar) > this.getPowerCapacityByRank(rar)) {
      drif.level = oldLevel;
      this.snackBar.open("Jeden lub więcej drifów nie mógł zostać wymaksowany", "ok", {duration: 2500})
    }

  }

  getLeftPower(slot: string, modSlot: number) {
    let rarWithDrif = this.getActiveBuild()?.rarsWithDrifs?.filter(rar => rar.slot === slot)[0];
    if (!rarWithDrif) {
      console.log("LEFT POWER RAR WITH DRIF NOT FOUND");
      return 0;
    }
    let leftPower = this.getPowerCapacityByRank(rarWithDrif);

    let drifItem1 = rarWithDrif.drifItem1;
    let drifItem2 = rarWithDrif.drifItem2;
    let drifItem3 = rarWithDrif.drifItem3;
    if (drifItem1 != null && modSlot != 1) {
      leftPower -= this.drifService.getDrifPower(drifItem1.startPower, drifItem1.level || 1);
    }
    if (drifItem2 != null && modSlot != 2) {
      leftPower -= this.drifService.getDrifPower(drifItem2.startPower, drifItem2.level || 1);
    }
    if (drifItem3 != null && modSlot != 3) {
      leftPower -= this.drifService.getDrifPower(drifItem3.startPower, drifItem3.level || 1);
    }
    return leftPower;
  }

  printUsedCapacity(rarWithDrifs: RarWithDrifs): string {
    let cap = this.getPowerCapacityByRank(rarWithDrifs);
    let usedPower = this.countUsedPower(rarWithDrifs);
    let leftPower = cap - usedPower;
    return leftPower + "/" + cap;
  }

  getPowerCapacityByRank(rar: RarWithDrifs): number {
    if (rar.rank > 12) {
      return 0;
    }
    let capacity = rarsCapacity.filter(cap => cap.rank == rar.rank)[0].capacity;
    if (rar.ornaments && rar.ornaments >= 7) {
      if (rar.ornaments === 7) {
        capacity += 1;
      }
      if (rar.ornaments === 8) {
        capacity += 2;
      }
      if (rar.ornaments === 9) {
        capacity += 4;
      }
    }
    return capacity;
  }

  getButtonColorClassByDrifCategory(drif: Drif): string {
    switch (drif.category) {
      case DrifCategory.REDUCTION: {
        if (drif.shortName === this.illuminatedMod) {
          return "reductionDrif illuminate";
        }
        return "reductionDrif";
      }
      case DrifCategory.DAMAGE: {
        if (drif.shortName === this.illuminatedMod) {
          return "damageDrif illuminate";
        }
        return "damageDrif";
      }
      case DrifCategory.SPECIAL: {
        if (drif.shortName === this.illuminatedMod) {
          return "specialDrif illuminate";
        }
        return "specialDrif";
      }
      case DrifCategory.DEFENCE: {
        if (drif.shortName === this.illuminatedMod) {
          return "defenceDrif illuminate";
        }
        return "defenceDrif";
      }
      case DrifCategory.ACCURACY: {
        if (drif.shortName === this.illuminatedMod) {
          return "accuracyDrif illuminate";
        }
        return "accuracyDrif";
      }
    }
  }

  getModSummaryByCategory(modSummary: ModSummary[], category: DrifCategory) {
    return modSummary
      .filter(sum => sum.category === category)
      .sort((a, b) => a.mod.localeCompare(b.mod));
  }

  illuminateHoovered(mod: ModSummary) {
    this.illuminatedMod = mod.drifName;
  }

  clearIlluminated() {
    this.illuminatedMod = "";
  }

  prepareModSummaryRow(summary: ModSummary): string {
    let row;
    if (summary.mod === PsychoMod.EXTRA_AP) {
      row = summary.amountDrifs + "x " + this.translate.instant('PSYCHO_EFFECTS.' + summary.mod) + ": " + summary.modSum;
    } else {
      if (summary.reducedPercent) {
        row = summary.amountDrifs + "x " + this.translate.instant('PSYCHO_EFFECTS.' + summary.mod) + ': <u title="' + summary.reducedPercent + '% sumy efektu -' + summary.reducedValue?.toFixed(2) + '%">' + summary.modSum.toFixed(2) + "%</u>";
      } else {
        row = summary.amountDrifs + "x " + this.translate.instant('PSYCHO_EFFECTS.' + summary.mod) + ": " + summary.modSum.toFixed(2) + "%";
      }

    }

    if (summary.max) {
      row = row + " (max: " + summary.max + "%)";
    }
    row = row + " [" + summary.drifName + "] ";
    return row;
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveBuild(this.activeBuild);
  }

  saveBuild(name: string) {
    if (!this.drifs || this.drifs.length === 0) {
      return;
    }
    let temp = this.userRarsWithDrifs.find(rars => rars.name === name);
    let dataArray = localStorage.getItem('drif-simulator-array');
    if (!dataArray) {
      localStorage.setItem('drif-simulator-array', JSON.stringify(this.userRarsWithDrifs, function replacer(key, value) {
        return value;
      }));
    }

    if (!temp) {
      console.log("TEMP NULL");
      return;
    }

    let parse: UserRarsWithDrifs[];
    if (dataArray) {
      parse = JSON.parse(dataArray);
    } else {
      parse = this.userRarsWithDrifs;
    }

    let tempParsedRars = parse.find(rars => rars.name === name);
    if (!tempParsedRars) {
      console.log('tempParsedRars null')
      return;
    }

    tempParsedRars.rarsWithDrifs = temp.rarsWithDrifs;
    tempParsedRars.critEpicModLevel = temp.critEpicModLevel;
    tempParsedRars.dedicatedEpicModLevel = temp.dedicatedEpicModLevel;

    localStorage.setItem("drif-simulator-array", JSON.stringify(parse, function replacer(key, value) {
      return value;
    }));
  }

  load() {
    let data = localStorage.getItem('drif-simulator');
    if (data != null) {
      let tempRars = this.userRarsWithDrifs.find(rars => rars.name === 'temp');
      if (!tempRars) {
        console.log("TEMP RARS NOT FOUND")
        return;
      }
      tempRars.rarsWithDrifs = JSON.parse(data);
      localStorage.removeItem("drif-simulator");
      this.saveBuild('temp');
      this.calculateModSummary();
      return;
    }
    let dataArray = localStorage.getItem('drif-simulator-array');
    if (!dataArray) {
      return;
    }
    this.userRarsWithDrifs = JSON.parse(dataArray);
    this.userRarsWithDrifs.forEach(ur => {
      ur.rarsWithDrifs.forEach(r => {
        if (!r.ornaments) {
          r.ornaments = 1;
        }
        if (r.slot.toString() === "shield") {
          r.slot = InventorySlot.SHIELDORBRACES;
        }
        if (r.slot.toString() === "ring1") {
          r.slot = InventorySlot.RING_1;
        }
        if (r.slot.toString() === "ring2") {
          r.slot = InventorySlot.RING_2;
        }
        r.slot = <InventorySlot>r.slot.toUpperCase();
      })
    })

    this.calculateModSummary();
  }

  cloneBuild() {
    let activeBuild = this.userRarsWithDrifs.find(userRars => userRars.name === this.activeBuild);
    let buildToClone = this.userRarsWithDrifs.find(userRars => userRars.name === this.buildToClone);
    if (activeBuild && buildToClone) {
      activeBuild.rarsWithDrifs = JSON.parse(JSON.stringify(buildToClone.rarsWithDrifs));
      this.calculateModSummary();
      this.buildToClone = "";
    }
  }

  drop(event: CdkDragDrop<DragDrifItem[]>) {
    //console.log(event.container.data[event.currentIndex])
    //console.log(event.container.data[event.currentIndex])
    //console.log(event.previousContainer.data[event.previousIndex])
    if (event.previousContainer === event.container) {
      this.moveDrifInSameItem(event.previousContainer.data[event.previousIndex], event.currentIndex);
    } /*else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }*/
  }

  moveDrifInSameItem(dragDrif: DragDrifItem, to: number) {
    let activeBuild = this.getActiveBuild();
    let rar = activeBuild.rarsWithDrifs.find(rar => rar.slot === dragDrif.item);
    if (!rar) {
      return;
    }
    console.log("FROM: " + dragDrif.fromSlot);
    console.log("TO: " + to);
    switch (to) {
      case 0: {
        let oldDrif = this.cloneDrif(rar.drifItem1);
        rar.drifItem1 = this.cloneDrif(dragDrif.drif);
        this.changeDrifOnItem(rar, oldDrif, dragDrif.fromSlot);
        break;
      }
      case 1: {
        let oldDrif = this.cloneDrif(rar.drifItem2);
        rar.drifItem2 = this.cloneDrif(dragDrif.drif);
        this.changeDrifOnItem(rar, oldDrif, dragDrif.fromSlot);
        break;
      }
      case 2: {
        let oldDrif = this.cloneDrif(rar.drifItem3);
        rar.drifItem3 = this.cloneDrif(dragDrif.drif);
        this.changeDrifOnItem(rar, oldDrif, dragDrif.fromSlot);
        break;
      }
      default: {
        console.log("error");
        break;
      }
    }
  }

  changeDrifOnItem(rar: RarWithDrifs, drif: Drif | null, slot: number) {
    switch (slot) {
      case 0: {
        rar.drifItem1 = this.cloneDrif(drif);
        break;
      }
      case 1: {
        rar.drifItem2 = this.cloneDrif(drif);
        break;
      }
      case 2: {
        rar.drifItem3 = this.cloneDrif(drif);
        break;
      }
      default: break;
    }
  }

  getDragDrifItemArray(drif1: Drif | null, drif2: Drif | null, drif3: Drif | null, item: string) {
    let array: DragDrifItem[] = [
      {
        drif: drif1,
        fromSlot: 0,
        item: item
      },
      {
        drif: drif2,
        fromSlot: 1,
        item: item
      },
      {
        drif: drif3,
        fromSlot: 2,
        item: item
      }
    ];
    return array;
  }

  protected readonly InventorySlot = InventorySlot;

}

const epikItems: EpikItem[] = [
  {
    indexNumber: 13,
    name: "Żmij",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.DOUBLE_HIT_CHANCE,
    booster: 1.60
  },
  {
    indexNumber: 14,
    name: "Gorthdar",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.EXTRA_FIRE_DAMAGE,
    booster: 1.60
  },
  {
    indexNumber: 15,
    name: "Attawa",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.MAGICAL_HIT_MODIFIER,
    booster: 1.60
  },
  {
    indexNumber: 16,
    name: "Imisindo",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.RANGE_HIT_MODIFIER,
    booster: 1.60
  },
  {
    indexNumber: 17,
    name: "Washi",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.PHYSICAL_HIT_MODIFIER,
    booster: 1.60
  },
  {
    indexNumber: 18,
    name: "Allenor",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.PHYSICAL_DAMAGE_INCREASE,
    booster: 1.60
  },
  {
    indexNumber: 19,
    name: "Latarnia Życia",
    drifsTier: 3,
    psychoModPA: PsychoMod.EXTRA_AP,
    psychoModCrit: PsychoMod.CRIT_CHANCE,
    psychoModDedicated: PsychoMod.MANA_DRAIN,
    booster: 1.60
  }
]

const rarsCapacity: RarCapacity[] = [
  {
    rank: 1,
    capacity: 4,
    maxDrifs: 1
  },
  {
    rank: 2,
    capacity: 4,
    maxDrifs: 1
  },
  {
    rank: 3,
    capacity: 4,
    maxDrifs: 1
  },
  {
    rank: 4,
    capacity: 8,
    maxDrifs: 2
  },
  {
    rank: 5,
    capacity: 10,
    maxDrifs: 2
  },
  {
    rank: 6,
    capacity: 12,
    maxDrifs: 2
  },
  {
    rank: 7,
    capacity: 15,
    maxDrifs: 2
  },
  {
    rank: 8,
    capacity: 18,
    maxDrifs: 2
  },
  {
    rank: 9,
    capacity: 21,
    maxDrifs: 2
  },
  {
    rank: 10,
    capacity: 24,
    maxDrifs: 3
  },
  {
    rank: 11,
    capacity: 28,
    maxDrifs: 3
  },
  {
    rank: 12,
    capacity: 32,
    maxDrifs: 3
  },
]

const drifTiers: DrifTier[] = [
  {
    tier: 1,
    minItemRanks: 0,
    maxDrifLevel: 6
  },
  {
    tier: 2,
    minItemRanks: 4,
    maxDrifLevel: 11
  },
  {
    tier: 3,
    minItemRanks: 7,
    maxDrifLevel: 16
  },
  {
    tier: 4,
    minItemRanks: 10,
    maxDrifLevel: 21
  },
];

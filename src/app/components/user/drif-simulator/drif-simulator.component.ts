import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import drifTiers from "@models/drif/data/drifTier";
import amountReduction from "@models/drif/data/amountDrifReduction";
import rarsCapacity from "@models/drif/data/rarCapacity";
import {RarWithDrifs} from "@models/drif/rarWithDrifs";
import {MatDialog} from "@angular/material/dialog";
import {DrifSelectComponent} from "./drif-select/drif-select.component";
import {ModSummary} from "@models/drif/modSummary";
import modCaps from "@models/drif/data/modCap";
import epikItems from "@models/drif/data/epikItem";
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
  protected readonly InventorySlot = InventorySlot;

  modSummary: ModSummary[] = [];
  illuminatedMod: string = "";
  activeBuild: string = "temp";
  buildToClone: string = "";
  drifs: Drif[] = [];
  buildNames: string[] = ["temp", "build 1", "build 2", "build 3", "build 4", "build 5", "build 6", "build 7", "build 8", "build 9"]
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
    const slotKeys = Object.keys(InventorySlot) as (keyof typeof InventorySlot)[];
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
        rarsWithDrifs: [],
        critEpicModLevel: 16,
        dedicatedEpicModLevel: 16
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

  removeModFromItem(rar: RarWithDrifs, slot: number) {
    if (slot === 1) {
      rar.drifItem1 = null;
    }
    if (slot === 2) {
      rar.drifItem2 = null;
    }
    if (slot === 3) {
      rar.drifItem3 = null;
    }
  }

  changeModLevelAnItem(rarWithDrifs: RarWithDrifs, drifSlot: number, level: number, tier: number) {
    const drif = drifSlot === 1 ? rarWithDrifs.drifItem1 : drifSlot === 2 ? rarWithDrifs.drifItem2 : drifSlot === 3 ? rarWithDrifs.drifItem3 : null;
    this.doChangeModLevelAnItem(drif, rarWithDrifs, level, tier);
  }

  private doChangeModLevelAnItem(drif: Drif | null, rarWithDrifs: RarWithDrifs, level: number, tier: number) {
    if (drif) {
      let oldLevel = clone(drif.level);
      let oldTier = clone(drif.tier);
      drif.level = level;
      drif.tier = tier;
      if (this.countUsedPower(rarWithDrifs) > this.getPowerCapacityByRank(rarWithDrifs)) {
        drif.level = oldLevel;
        drif.tier = oldTier;
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
        this.countMod(rar.drifItem1, rar.ornaments, rar.sidragaBoost, false);
      }
      if (rar.drifItem2 && (rar.rank >= 4 || rar.ornaments >= 7)) {
        this.countMod(rar.drifItem2, rar.ornaments, rar.sidragaBoost, false);
      }
      if (rar.drifItem3 && rar.rank >= 10) {
        this.countMod(rar.drifItem3, rar.ornaments, rar.sidragaBoost, false);
      }
    });

    this.calculateRealModSum();
  }

  private validateLevels() {
    this.getActiveBuild().rarsWithDrifs.forEach(rar => {
      const drifMaxLevel1 = this.getDrifMaxLevel(rar.drifItem1);
      const drifMaxLevel2 = this.getDrifMaxLevel(rar.drifItem2);
      const drifMaxLevel3 = this.getDrifMaxLevel(rar.drifItem3);
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
    return find ? find.maxDrifLevel : 0;
  }

  calculateEpicMod(rank: number, ornaments: number) {
    let epikItem = epikItems.find(it => it.indexNumber === rank);
    if (!epikItem) {
      throw new Error("Epic item not found");
    }

    let dedicatedDrif = this.drifs.find(drif => drif.psychoMod === epikItem?.psychoModDedicated);
    let critDrifItem = this.drifs.find(drif => drif.psychoMod === epikItem?.psychoModCrit);

    if (!dedicatedDrif || !critDrifItem) {
      throw new Error("epic mods unknown");
    }

    //Old version fix
    dedicatedDrif.tier = 3;
    critDrifItem.tier = 3;
    if (!dedicatedDrif.level) {
      dedicatedDrif.level = 16;
    }
    if (!critDrifItem.level) {
      critDrifItem.level = 16;
    }
    //Counting
    this.countMod(dedicatedDrif, ornaments, false, true);
    this.countMod(critDrifItem, ornaments, false, true);

    //EXTRA AP
    this.modSummary.push({
      mod: PsychoMod.EXTRA_AP,
      drifName: "?",
      modSum: 1,
      amountDrifs: 1,
      category: DrifCategory.SPECIAL
    })
  }

  countMod(drif: Drif, ornaments: number, sidragaBoost: boolean, isEpic: boolean) {
    const psychoMod = drif.psychoMod;
    const modSummary = this.modSummary.find(modSum => modSum.mod === psychoMod);
    const psychoValue = this.countPsychoValue(drif, sidragaBoost, ornaments, isEpic);

    if (modSummary) {
      modSummary.modSum += psychoValue;
      modSummary.amountDrifs++;
    } else {
      let modCap = modCaps.find(capped => capped.mod === psychoMod);
      this.modSummary.push({
        mod: psychoMod,
        drifName: drif.shortName,
        modSum: psychoValue,
        amountDrifs: 1,
        category: drif.category,
        max: modCap?.value
      })
    }
  }

  private countPsychoValue(drif: Drif, sidragaBoost: boolean, ornaments: number, isEpic: boolean) {
    const drifTier = drifTiers.filter(drifTier => drifTier.tier === drif.tier)[0];
    const drifLevel = drif?.level || 1;
    const currentDrifTier = drif.tier || 1;

    let toAdd = drifLevel * drif.psychoGrowByLevel;
    toAdd += drif.psychoGrowByLevel * this.drifService.getDrifTierMultiplier(currentDrifTier)
    if (drifTier.tier === 4 && drifLevel >= 19) {
      toAdd += (drifLevel - 18) * drif.psychoGrowByLevel;
    }
    let specialBoost = this.countSpecialBoost(sidragaBoost, isEpic, ornaments);
    return toAdd * specialBoost;
  }

  private countSpecialBoost(sidragaBoost: boolean, isEpic: boolean, ornaments: number) {
    let specialBoost = 1;
    specialBoost += isEpic ? 0.6 : 0;
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

  private getDrifTier(rar: RarWithDrifs, slot: number): number {
    return slot === 1 ? rar.drifItem1?.tier || 1 : slot === 2 ? rar.drifItem2?.tier || 2 : slot === 3 ? rar.drifItem3?.tier || 1 : 1;
  }

  private getDrifLevel(rar: RarWithDrifs, slot: number): number {
    return slot === 1 ? rar.drifItem1?.level || 0 : slot === 2 ? rar.drifItem2?.level || 0 : slot === 3 ? rar.drifItem3?.level || 0 : 0;
  }

  countUsedPower(eq: RarWithDrifs) {
    return this.drifService.countUsedPower(eq.drifItem1, eq.drifItem2, eq.drifItem3, eq.ornaments, eq.rank)
  }

  private assignDrifToItem(drif: Drif, rarWithDrifs: RarWithDrifs, slot: number) {
    if (slot === 1 && (rarWithDrifs.drifItem2?.psychoMod !== drif.psychoMod && rarWithDrifs.drifItem3?.psychoMod !== drif.psychoMod)) {
      rarWithDrifs.drifItem1 = cloneDeep(drif);
      return;
    }
    if (slot === 2 && (rarWithDrifs.drifItem1?.psychoMod !== drif.psychoMod && rarWithDrifs.drifItem3?.psychoMod !== drif.psychoMod)) {
      rarWithDrifs.drifItem2 = cloneDeep(drif);
      return;
    }
    if (slot === 3 && (rarWithDrifs.drifItem1?.psychoMod !== drif.psychoMod && rarWithDrifs.drifItem2?.psychoMod !== drif.psychoMod)) {
      rarWithDrifs.drifItem3 = cloneDeep(drif);
      return;
    }
    this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_EXIST", {name: drif.shortName}), "ok", {duration: 1500});
  }

  maximiseDrifLevels() {
    let rars = this.userRarsWithDrifs.find(rars => rars.name === this.activeBuild);
    if (!rars) {
      return;
    }
    rars.rarsWithDrifs.forEach(rar => {
      const drif1 = rar.drifItem1;
      const drif2 = rar.drifItem2;
      const drif3 = rar.drifItem3;
      if (drif1) {
        this.doMaximiseLevel(drif1, rar);
      }
      if (drif2) {
        this.doMaximiseLevel(drif2, rar);
      }
      if (drif3) {
        this.doMaximiseLevel(drif3, rar);
      }
    });
    rars.critEpicModLevel = 16;
    rars.dedicatedEpicModLevel = 16;
    this.calculateModSummary();

  }

  private doMaximiseLevel(drif: Drif, rar: RarWithDrifs) {
    const tier = drifTiers.find(drifTier => drifTier.tier === drif.tier);
    if (!tier) {
      throw new Error("FATAL ERROR: Tier not found")
    }
    const oldLevel = clone(drif.level);
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
        let oldDrif = cloneDeep(rar.drifItem1);
        rar.drifItem1 = cloneDeep(dragDrif.drif);
        this.changeDrifOnItem(rar, oldDrif, dragDrif.fromSlot);
        break;
      }
      case 1: {
        let oldDrif = cloneDeep(rar.drifItem2);
        rar.drifItem2 = cloneDeep(dragDrif.drif);
        this.changeDrifOnItem(rar, oldDrif, dragDrif.fromSlot);
        break;
      }
      case 2: {
        let oldDrif = cloneDeep(rar.drifItem3);
        rar.drifItem3 = cloneDeep(dragDrif.drif);
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
        rar.drifItem1 = cloneDeep(drif);
        break;
      }
      case 1: {
        rar.drifItem2 = cloneDeep(drif);
        break;
      }
      case 2: {
        rar.drifItem3 = cloneDeep(drif);
        break;
      }
      default:
        break;
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
}

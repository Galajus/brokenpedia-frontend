import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {DrifItem} from "./model/drifItem";
import {DrifTier} from "./model/drifTier";
import amountReduction from "./model/amountDrifReduction";
import {RarCapacity} from "./model/rarCapacity";
import {RarWithDrifs} from "./model/rarWithDrifs";
import {MatDialog} from "@angular/material/dialog";
import {DrifSelectComponent} from "./drif-select/drif-select.component";
import {ModSummary} from "./model/modSummary";
import {PsychoMod} from "../../../common/model/psychoMod";
import modCaps from "./model/modCap";
import {EpikItem} from "./model/epikItem";
import {UserRarsWithDrifs} from "./model/userRarsWithDrifs";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {DragDrifItem} from "./model/dragDrifItem";
import {clone, cloneDeep, floor, round} from "lodash-es";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-drif-simulator',
  templateUrl: './drif-simulator.component.html',
  styleUrls: ['./drif-simulator.component.scss']
})
export class DrifSimulatorComponent implements OnInit, OnDestroy {

  protected readonly Number = Number;

  modSummary: ModSummary[] = [];
  illuminatedMod: string = "";
  activeBuild: string = "temp";
  buildToClone: string = "";


  userRarsWithDrifs: UserRarsWithDrifs[] = [
    {
      name: "temp",
      rarsWithDrifs: []
    },
    {
      name: "build 1",
      rarsWithDrifs: []
    },
    {
      name: "build 2",
      rarsWithDrifs: []
    },
    {
      name: "build 3",
      rarsWithDrifs: []
    },
    {
      name: "build 4",
      rarsWithDrifs: []
    },
    {
      name: "build 5",
      rarsWithDrifs: []
    },
    {
      name: "build 6",
      rarsWithDrifs: []
    },
    {
      name: "build 7",
      rarsWithDrifs: []
    },
    {
      name: "build 8",
      rarsWithDrifs: []
    },
    {
      name: "build 9",
      rarsWithDrifs: []
    }
  ];

  rarsWithDrifsTemplate: RarWithDrifs[] = [
    {
      slot: 'weapon',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'helmet',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'armor',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'pants',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'boots',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'shield',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'belt',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'cape',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'gloves',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'amulet',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'ring1',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
    {
      slot: 'ring2',
      rank: 2,
      ornaments: 1,
      sidragaBoost: false,
      drifItem1: null,
      drifItem2: null,
      drifItem3: null
    },
  ]

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.fillUserRars();
    this.load();
  }

  ngOnDestroy() {
    this.saveBuild(this.activeBuild);
  }

  fillUserRars() {
    //.userRarsWithDrifs.forEach(rars => rars.rarsWithDrifs = Object.assign({}, this.rarsWithDrifsTemplate));
    this.userRarsWithDrifs.forEach(rars => rars.rarsWithDrifs = JSON.parse(JSON.stringify(this.rarsWithDrifsTemplate)));
  }

  resetBuild(name: string) {
    let userRarsWithDrifs = this.userRarsWithDrifs.find(userRars => userRars.name === name);
    if (userRarsWithDrifs) {
      userRarsWithDrifs.rarsWithDrifs = JSON.parse(JSON.stringify(this.rarsWithDrifsTemplate));
      this.calculateModSummary();
    }
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

  openDrifDialog(enterAnimationDuration: string, exitAnimationDuration: string, rarWithDrifs: RarWithDrifs, drifSlot: number): void {
    const dialogRef = this.dialog.open(DrifSelectComponent, {
      width: '1000px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        leftPower: this.getLeftPower(rarWithDrifs.slot, drifSlot),
        rarRank: rarWithDrifs.rank,
        drifSlot: drifSlot,
        drifTier: this.getDrifTier(rarWithDrifs, drifSlot),
        drifLevel: this.getDrifLevel(rarWithDrifs, drifSlot),
        itemSlot: rarWithDrifs.slot
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

  private getDrifMaxLevel(drif: DrifItem | null): number {
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
      console.log("NOT FOUND EPIC ITEM");
      return;
    }

    let dedicatedDrifItem = drifs.find(drif => this.getPsychoModByString(drif.psychoMod) === epikItem?.psychoModDedicated);
    let critDrifItem = drifs.find(drif => this.getPsychoModByString(drif.psychoMod) === epikItem?.psychoModCrit);

    if (!dedicatedDrifItem && epikItem.name === "Latarnia Życia") {
      dedicatedDrifItem = manaDrainDrifItem;
    }

    if (!dedicatedDrifItem || !critDrifItem) {
      console.log("epik mods unknown");
      return;
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
    let modCap = modCaps.find(capped => capped.mod === this.getPsychoModByString(dedicatedDrifItem?.psychoMod));
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
    let modCapCrit = modCaps.find(capped => capped.mod === this.getPsychoModByString(critDrifItem?.psychoMod));
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
      category: "SPECIAL"
    })
  }

  countMod(drif: DrifItem, ornaments: number, sidragaBoost: boolean) {
    let drifTier = drifTiers.filter(drifTier => drifTier.tier === drif.tier)[0];
    let psychoMod = this.getPsychoModByString(drif.psychoMod);
    let modSummary = this.modSummary.find(modSum => modSum.mod === psychoMod);
    if (modSummary) {
      let toAdd = 0;
      toAdd += drif.level * drif.psychoGrowByLevel;
      toAdd += drif.psychoGrowByLevel * (drif.tier - 1);
      if (drif.tier === 3) {
        toAdd += drif.psychoGrowByLevel;
      }
      if (drif.tier === 4) {
        toAdd += drif.psychoGrowByLevel * 2;
      }
      modSummary.amountDrifs++;
      //modSummary.modSum += drif.level * drif.psychoGrowByLevel;
      //modSummary.modSum += drif.psychoGrowByLevel * (drif.tier - 1);
      if (drifTier.tier === 4 && drif.level >= 19) {
        //modSummary.modSum += (drif.level - 18) * drif.psychoGrowByLevel;
        toAdd += (drif.level - 18) * drif.psychoGrowByLevel;
      }
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
      toAdd = toAdd * specialBoost;
      modSummary.modSum += toAdd;
    } else {
      let value = drif.level * drif.psychoGrowByLevel;
      value += drif.psychoGrowByLevel * (drif.tier - 1);
      if (drifTier.tier === 4 && drif.level >= 19) {
        value += (drif.level - 18) * drif.psychoGrowByLevel;
      }
      if (drif.tier === 3) {
        value += drif.psychoGrowByLevel;
      }
      if (drif.tier === 4) {
        value += drif.psychoGrowByLevel * 2;
      }
      let specialBoost = 1;
      if (sidragaBoost) {
        specialBoost += 0.15;
      }
      if (ornaments === 7) {
        specialBoost += 1.03;
      }
      if (ornaments === 8) {
        specialBoost += 1.08;
      }
      if (ornaments === 9) {
        specialBoost += 0.15;
      }
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
          return rarWithDrifs.drifItem1.tier;
        }
        break;
      }
      case 2: {
        if (rarWithDrifs.drifItem2) {
          return rarWithDrifs.drifItem2.tier;
        }
        break;
      }
      case 3: {
        if (rarWithDrifs.drifItem3) {
          return rarWithDrifs.drifItem3.tier;
        }
        break;
      }
    }
    return 1;
  }

  private getDrifLevel(rarWithDrifs: RarWithDrifs, drifSlot: number): number {
    switch (drifSlot) {
      case 1: {
        if (rarWithDrifs.drifItem1) {
          return rarWithDrifs.drifItem1.level;
        }
        break;
      }
      case 2: {
        if (rarWithDrifs.drifItem2) {
          return rarWithDrifs.drifItem2.level;
        }
        break;
      }
      case 3: {
        if (rarWithDrifs.drifItem3) {
          return rarWithDrifs.drifItem3.level;
        }
        break;
      }
    }
    return 0;
  }

  private assignDrifToItem(drif: DrifItem, rarWithDrifs: RarWithDrifs, slot: number) {

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

  cloneDrif(drif: DrifItem | null) {
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
    } as DrifItem;
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

  private doMaximiseLevel(drif: DrifItem, rar: RarWithDrifs) {
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
      leftPower -= drifItem1.startPower * this.getDrifPowerBooster(drifItem1.level);
    }
    if (drifItem2 != null && modSlot != 2) {
      leftPower -= drifItem2.startPower * this.getDrifPowerBooster(drifItem2.level);
    }
    if (drifItem3 != null && modSlot != 3) {
      leftPower -= drifItem3.startPower * this.getDrifPowerBooster(drifItem3.level);
    }
    return leftPower;
  }

  printUsedCapacity(rarWithDrifs: RarWithDrifs): string {
    let cap = this.getPowerCapacityByRank(rarWithDrifs);
    let usedPower = this.countUsedPower(rarWithDrifs);
    let leftPower = cap - usedPower;
    return leftPower + "/" + cap;
  }

   countUsedPower(rarWithDrifs: RarWithDrifs) {
    let usedPower = 0;

    let drifItem1 = rarWithDrifs.drifItem1;
    let drifItem2 = rarWithDrifs.drifItem2;
    let drifItem3 = rarWithDrifs.drifItem3;
    if (drifItem1) {
      usedPower += drifItem1.startPower * this.getDrifPowerBooster(drifItem1.level);
    }
    if (drifItem2 && (rarWithDrifs.rank >= 4 || rarWithDrifs.ornaments >=7)) {
      usedPower += drifItem2.startPower * this.getDrifPowerBooster(drifItem2.level);
    }
    if (drifItem3  && rarWithDrifs.rank >= 10) {
      usedPower += drifItem3.startPower * this.getDrifPowerBooster(drifItem3.level);
    }
    return usedPower;
  }

  getDrifPowerBooster(level: number) {
    let booster = round((level + 1)/ 5, 0);
    if (booster === 0) {
      return 1;
    }
    return booster;
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

  getButtonColorClassByDrifCategory(drif: DrifItem): string {
    switch (drif.category) {
      case "REDUCTION": {
        if (drif.shortName === this.illuminatedMod) {
          return "reductionDrif illuminate";
        }
        return "reductionDrif";
      }
      case "DAMAGE": {
        if (drif.shortName === this.illuminatedMod) {
          return "damageDrif illuminate";
        }
        return "damageDrif";
      }
      case "SPECIAL": {
        if (drif.shortName === this.illuminatedMod) {
          return "specialDrif illuminate";
        }
        return "specialDrif";
      }
      case "DEFENCE": {
        if (drif.shortName === this.illuminatedMod) {
          return "defenceDrif illuminate";
        }
        return "defenceDrif";
      }
      case "ACCURACY": {
        if (drif.shortName === this.illuminatedMod) {
          return "accuracyDrif illuminate";
        }
        return "accuracyDrif";
      }
    }
    return "";
  }

  getModSummaryByCategory(modSummary: ModSummary[], category: string) {
    switch (category) {
      case "REDUCTION": {
        return modSummary
          .filter(sum => sum.category === "REDUCTION")
          .sort((a, b) => a.mod.localeCompare(b.mod));
      }
      case "DAMAGE": {
        return modSummary.filter(sum => sum.category === "DAMAGE")
          .sort((a, b) => a.mod.localeCompare(b.mod));
      }
      case "SPECIAL": {
        return modSummary.filter(sum => sum.category === "SPECIAL")
          .sort((a, b) => a.mod.localeCompare(b.mod));
      }
      case "DEFENCE": {
        return modSummary.filter(sum => sum.category === "DEFENCE")
          .sort((a, b) => a.mod.localeCompare(b.mod));
      }
      case "ACCURACY": {
        return modSummary.filter(sum => sum.category === "ACCURACY")
          .sort((a, b) => a.mod.localeCompare(b.mod));
      }
    }
    return null;
  }

  getPsychoModByString(mod: string | undefined) {
    if (mod) {
      return (<any>PsychoMod)[mod];
    }
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
      row = summary.amountDrifs + "x " + summary.mod + ": " + summary.modSum;
    } else {
      if (summary.reducedPercent) {
        row = summary.amountDrifs + "x " + summary.mod + ': <u title="' + summary.reducedPercent + '% sumy efektu -' + summary.reducedValue?.toFixed(2) + '%">' + summary.modSum.toFixed(2) + "%</u>";
      } else {
        row = summary.amountDrifs + "x " + summary.mod + ": " + summary.modSum.toFixed(2) + "%";
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

  changeDrifOnItem(rar: RarWithDrifs, drif: DrifItem | null, slot: number) {
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

  getDragDrifItemArray(drif1: DrifItem | null, drif2: DrifItem | null, drif3: DrifItem | null, item: string) {
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

const manaDrainDrifItem: DrifItem = {
  tier: 3,
  level: 1,
  startPower: 1,
  psychoGrowByLevel: 0.5,
  psychoMod: "MANA_DRAIN",
  category: "SPECIAL",
  shortName: "err"
}

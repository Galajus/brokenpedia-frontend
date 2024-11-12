import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import drifTiers from "@models/drif/data/drifTier";
import amountReduction from "@models/drif/data/amountDrifReduction";
import rarsCapacity from "@models/drif/data/rarCapacity";
import {RarWithDrifs} from "@models/drif/rarWithDrifs";
import {MatDialog} from "@angular/material/dialog";
import {DrifSelectComponent} from "./drif-select/drif-select.component";
import {ModSummary} from "@models/drif/modSummary";
import modCaps from "@models/drif/data/modCap";
import {EpicDedicatedMod} from "@models/drif/epicDedicatedMod";
import {UserRarsWithDrifs} from "@models/drif/userRarsWithDrifs";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {DragDrifItem} from "@models/drif/dragDrifItem";
import {clone, cloneDeep} from "lodash-es";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PsychoMod} from "@models/items/psychoMod";
import {TranslateService} from "@ngx-translate/core";
import {DrifService} from "@services/user/drif/drif.service";
import {DrifCategory} from "@models/drif/drifCategory";
import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";
import {SwapDrifItem} from "@models/drif/swapDrifItem";

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
  epicsMods: EpicDedicatedMod[] = [];
  buildNames: string[] = ["temp", "build 1", "build 2", "build 3", "build 4", "build 5", "build 6", "build 7", "build 8", "build 9"]
  userRarsWithDrifs: UserRarsWithDrifs[] = [];
  swappingMode = false;
  swapDrif: SwapDrifItem | null = null;

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
    this.drifService.getDrifSimulatorData()
      .subscribe(
        {
          next: (response) => {
            this.drifs = response.drifs;
            this.epicsMods = response.epicsDedicatedMods;
          },
          error: () => {
            throw new Error("LOADING DATA ERROR");
          },
          complete: () => {
            this.load();
          }
        }
      );
  }

  ngOnDestroy() {
    this.saveBuild(this.activeBuild);
  }

  fillUserRars() {
    this.userRarsWithDrifs.forEach(rars => rars.rarsWithDrifs = this.generateRarsWithDrifsTemplate());
  }

  resetBuild(name: string) {
    const userRarsWithDrifs = this.userRarsWithDrifs.find(userRars => userRars.name === name);
    if (userRarsWithDrifs) {
      userRarsWithDrifs.rarsWithDrifs = this.generateRarsWithDrifsTemplate();
      this.calculateModSummary();
    }
  }

  generateRarsWithDrifsTemplate() {
    const rarsWithDrifsTemplate: RarWithDrifs[] = [];
    const slotKeys = Object.keys(InventorySlot) as (keyof typeof InventorySlot)[];
    slotKeys.forEach(k => {
      rarsWithDrifsTemplate.push({
        slot: InventorySlot[k],
        rank: 2,
        ornaments: 1,
        sidragaBoost: false,
        epikBoost: false,
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
    const find = this.userRarsWithDrifs.find(rars => rars.name === this.activeBuild);
    if (!find) {
      throw "NOT FOUND ACTIVE BUILD";
    }
    return find;
  }

  setActiveBuild(name: string) {
    this.saveBuild(this.activeBuild);
    this.activeBuild = name;
    this.swappingMode = false;
    this.swapDrif = null;
    this.calculateModSummary();
  }

  doSwap(rarWithDrifs: RarWithDrifs, drifSlot: number): void {
    if (!this.swapDrif) {
      this.swapDrif = {
        slot: drifSlot,
        item: rarWithDrifs
      }
      return;
    }

    const firstDrif = this.getDrifFromSlot(this.swapDrif.item, this.swapDrif.slot);
    const secondDrif = this.getDrifFromSlot(rarWithDrifs, drifSlot);

    const swapTestOne = this.canBeSwapped(secondDrif, this.swapDrif.item, this.swapDrif.slot);
    const swapTestTwo = this.canBeSwapped(firstDrif, rarWithDrifs, drifSlot);

    const sameItem = this.swapDrif.item === rarWithDrifs;

    if (!sameItem && (!swapTestOne || !swapTestTwo)) {
      this.snackBar.open("Zamiana tych drifów nie jest dozwolona", "ok", {duration: 1500});
      return;
    }
    this.doAssignDrifToItem(this.swapDrif.item, secondDrif, this.swapDrif.slot)
    this.doAssignDrifToItem(rarWithDrifs,firstDrif, drifSlot)

    this.swapDrif = null;

    this.calculateModSummary();
  }

  canBeSwapped(drif: Drif | null, rar: RarWithDrifs, slot: number): boolean {
    if (!this.swapDrif) {
      return true;
    }

    let leftPower = this.getLeftPower(rar.slot, slot);

    const drifPower: number = drif == null ? 0 : this.drifService.getDrifPower(drif.startPower, drif.level || 1);

    if (drifPower > leftPower) {
      return false;
    }

    const maxTier = !drif ? 4 : rar.rank >= 10 ? 4 : rar.rank >= 7 ? 3 : rar.rank >= 4 ? 2 : 1;
    const drifTier = drif?.tier ? drif.tier : 0;
    if (drifTier > maxTier) {
      return false;
    }

    if (this.isElementalDamageDrif(drif) && rar.slot !== InventorySlot.WEAPON) {
      return false;
    }

    if (drif && drif.psychoMod === PsychoMod.MANA_DRAIN && rar.slot !== InventorySlot.WEAPON) {
      return false;
    }

    const containsThatMod = this.itemContainsThatMod(drif, rar, slot);

    if (containsThatMod) {
      return false;
    }

    return true;
  }

  openDrifDialog(rarWithDrifs: RarWithDrifs, drifSlot: number): void {
    if (this.swappingMode) {
      this.doSwap(rarWithDrifs, drifSlot);
      return;
    }
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
      const oldLevel = clone(drif.level);
      const oldTier = clone(drif.tier);
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
    const activeBuild = this.getActiveBuild();
    activeBuild.rarsWithDrifs.forEach(rar => {
      if (rar.rank > 12) {
        this.calculateEpicMod(rar, activeBuild);
        return;
      }
      if (rar.drifItem1) {
        this.countMod(rar.drifItem1, rar.ornaments, rar.sidragaBoost, false, rar.epikBoost);
      }
      if (rar.drifItem2 && (rar.rank >= 4 || rar.ornaments >= 7)) {
        this.countMod(rar.drifItem2, rar.ornaments, rar.sidragaBoost, false, rar.epikBoost);
      }
      if (rar.drifItem3 && rar.rank >= 10) {
        this.countMod(rar.drifItem3, rar.ornaments, rar.sidragaBoost, false, rar.epikBoost);
      }
      if (rar.epikBoost && rar.rank === 12) {
        this.addExtraApToSummary(true);
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
    const find = drifTiers.find(dt => {
      return dt.tier === drif.tier;
    });
    return find ? find.maxDrifLevel : 0;
  }

  calculateEpicMod(rar: RarWithDrifs, userConfig: UserRarsWithDrifs) {
    const dedicatedMod = this.epicsMods.find(e => e.id === rar.rank - 12);
    if (!dedicatedMod) {
      throw new Error("Epic mod not found");
    }

    const dedicatedDrif = this.drifs.find(drif => drif.psychoMod === dedicatedMod.effect);
    const critDrifItem = this.drifs.find(drif => drif.psychoMod === PsychoMod.CRIT_CHANCE);

    if (!dedicatedDrif || !critDrifItem) {
      throw new Error("epic mods unknown");
    }

    dedicatedDrif.tier = 3;
    critDrifItem.tier = 3;
    if (!userConfig.dedicatedEpicModLevel) {
      userConfig.dedicatedEpicModLevel = 16;
    }
    if (!userConfig.critEpicModLevel) {
      userConfig.critEpicModLevel = 16;
    }
    dedicatedDrif.level = userConfig.dedicatedEpicModLevel;
    critDrifItem.level = userConfig.critEpicModLevel;

    //Counting
    this.countMod(dedicatedDrif, rar.ornaments, false, true, false);
    this.countMod(critDrifItem, rar.ornaments, false, true, false);

    //EXTRA AP
    this.addExtraApToSummary(false);
  }

  countMod(drif: Drif, ornaments: number, sidragaBoost: boolean, isEpic: boolean, epikBoost: boolean) {
    const psychoMod = drif.psychoMod;
    const modSummary = this.modSummary.find(modSum => modSum.mod === psychoMod);
    const psychoValue = this.countPsychoValue(drif, sidragaBoost, ornaments, isEpic, epikBoost);

    if (modSummary) {
      modSummary.modSum += psychoValue;
      modSummary.amountDrifs++;
    } else {
      const modCap = modCaps.find(capped => capped.mod === psychoMod);
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

  private addExtraApToSummary(isEpicV2: boolean) {
    this.modSummary.push({
      mod: PsychoMod.EXTRA_AP,
      drifName: "?",
      modSum: 1,
      amountDrifs: 1,
      category: DrifCategory.SPECIAL
    });
    if (isEpicV2) {
      this.modSummary.push({
        mod: PsychoMod.EXTRA_ATTACK_CIRCLE,
        drifName: "??",
        modSum: 1,
        amountDrifs: 1,
        category: DrifCategory.SPECIAL
      });
    }

  }

  private countPsychoValue(drif: Drif, sidragaBoost: boolean, ornaments: number, isEpic: boolean, epikBoost: boolean) {
    const drifTier = drifTiers.filter(drifTier => drifTier.tier === drif.tier)[0];
    const drifLevel = drif?.level || 1;
    const currentDrifTier = drif.tier || 1;

    let toAdd = drifLevel * drif.psychoGrowByLevel;
    toAdd += drif.psychoGrowByLevel * this.drifService.getDrifTierMultiplier(currentDrifTier)
    if (drifTier.tier === 4 && drifLevel >= 19) {
      toAdd += (drifLevel - 18) * drif.psychoGrowByLevel;
    }
    const specialBoost = this.countSpecialBoost(sidragaBoost, isEpic, ornaments, epikBoost);
    return toAdd * specialBoost;
  }

  private countSpecialBoost(sidragaBoost: boolean, isEpic: boolean, ornaments: number, epikBoost: boolean) {
    let specialBoost = 1;
    specialBoost += isEpic ? 0.6 : 0;
    if (sidragaBoost) {
      specialBoost += 0.15;
    }
    if (epikBoost) {
      specialBoost += 0.6;
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
        const amountDrifReduction = amountReduction.find(red => red.amount === modSum.amountDrifs);
        if (amountDrifReduction) {
          const oldSum = cloneDeep(modSum.modSum);
          modSum.modSum = modSum.modSum * amountDrifReduction.efektSum;
          modSum.reducedValue = oldSum - modSum.modSum;
          modSum.reducedPercent = amountDrifReduction.efektSum * 100;
        }
      }
    });

    this.assignGuaranteedMods();
  }

  assignGuaranteedMods() {
    //todo refactor for better usage
    const critMod = this.modSummary.find(m => m.mod === PsychoMod.CRIT_CHANCE);
    if (critMod) {
      critMod.modSum += 2;
    } else {
      const modCap = modCaps.find(capped => capped.mod === PsychoMod.CRIT_CHANCE);
      const drif = this.drifs.find(d => d.psychoMod === PsychoMod.CRIT_CHANCE);
      if (!drif) {
        throw new Error("GuaranteedModNotFound")
      }
      this.modSummary.push({
        mod: drif.psychoMod,
        drifName: drif.shortName,
        amountDrifs: 0,
        category: drif.category,
        modSum: 2,
        max: modCap?.value
      })
    }

    const manaRegenMod = this.modSummary.find(m => m.mod === PsychoMod.MANA_REGENERATION);
    if (manaRegenMod) {
      manaRegenMod.modSum += 5;
    } else {
      const modCap = modCaps.find(capped => capped.mod === PsychoMod.MANA_REGENERATION);
      const drif = this.drifs.find(d => d.psychoMod === PsychoMod.MANA_REGENERATION);
      if (!drif) {
        throw new Error("GuaranteedModNotFound")
      }
      this.modSummary.push({
        mod: drif.psychoMod,
        drifName: drif.shortName,
        amountDrifs: 0,
        category: drif.category,
        modSum: 5,
        max: modCap?.value
      })
    }

    const staminaRegenMod = this.modSummary.find(m => m.mod === PsychoMod.STAMINA_REGENERATION);
    if (staminaRegenMod) {
      staminaRegenMod.modSum += 5;
    } else {
      const modCap = modCaps.find(capped => capped.mod === PsychoMod.STAMINA_REGENERATION);
      const drif = this.drifs.find(d => d.psychoMod === PsychoMod.STAMINA_REGENERATION);
      if (!drif) {
        throw new Error("GuaranteedModNotFound")
      }
      this.modSummary.push({
        mod: drif.psychoMod,
        drifName: drif.shortName,
        amountDrifs: 0,
        category: drif.category,
        modSum: 5,
        max: modCap?.value
      })
    }
  }

  private getDrifTier(rar: RarWithDrifs, slot: number): number {
    return slot === 1 ? rar.drifItem1?.tier || 1 : slot === 2 ? rar.drifItem2?.tier || 2 : slot === 3 ? rar.drifItem3?.tier || 1 : 1;
  }

  private getDrifLevel(rar: RarWithDrifs, slot: number): number {
    return slot === 1 ? rar.drifItem1?.level || 0 : slot === 2 ? rar.drifItem2?.level || 0 : slot === 3 ? rar.drifItem3?.level || 0 : 0;
  }

  private getDrifFromSlot(rar: RarWithDrifs, slot: number): Drif | null {
    switch (slot) {
      case 1:
        return rar.drifItem1;
      case 2:
        return rar.drifItem2;
      case 3:
        return rar.drifItem3;
      default:
        return null;
    }
  }

  countUsedPower(eq: RarWithDrifs) {
    return this.drifService.countUsedPower(eq.drifItem1, eq.drifItem2, eq.drifItem3, eq.ornaments, eq.rank)
  }

  private assignDrifToItem(drif: Drif | null, rarWithDrifs: RarWithDrifs, slot: number) {
    if (!drif) {
      this.removeModFromItem(rarWithDrifs, slot)
      return;
    }
    if (this.isElementalDamageDrif(drif)) {
      if (slot === 1 && (this.isElementalDamageDrif(rarWithDrifs.drifItem2) || this.isElementalDamageDrif(rarWithDrifs.drifItem3))) {
        this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_LIMITED"), "ok", {duration: 1500});
        return;
      }
      if (slot === 2 && (this.isElementalDamageDrif(rarWithDrifs.drifItem1) || this.isElementalDamageDrif(rarWithDrifs.drifItem3))) {
        this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_LIMITED"), "ok", {duration: 1500});
        return;
      }
      if (slot === 3 && (this.isElementalDamageDrif(rarWithDrifs.drifItem1) || this.isElementalDamageDrif(rarWithDrifs.drifItem2))) {
        this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_LIMITED"), "ok", {duration: 1500});
        return;
      }
    }

    const containsThatMod = this.itemContainsThatMod(drif, rarWithDrifs, slot);
    if (!containsThatMod) {
      this.doAssignDrifToItem(rarWithDrifs, drif, slot);
      return;
    }

    this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_EXIST", {name: drif.shortName}), "ok", {duration: 1500});
  }

  private doAssignDrifToItem(rar: RarWithDrifs, drif: Drif | null, slot: number) {
    if (slot === 1) {
      rar.drifItem1 = cloneDeep(drif);
    }
    if (slot === 2) {
      rar.drifItem2 = cloneDeep(drif);
    }
    if (slot === 3) {
      rar.drifItem3 = cloneDeep(drif);
    }
  }

  /**
   * Check if item contains drif with specific mod excluding slot with a change process in future
   * @param drif
   * @param rar
   * @param swapSlot
   * @private
   */
  private itemContainsThatMod(drif: Drif | null, rar: RarWithDrifs, swapSlot: number): boolean {
    if (!drif) {
      return false;
    }
    if (swapSlot === 1 && (rar.drifItem2?.psychoMod !== drif.psychoMod && rar.drifItem3?.psychoMod !== drif.psychoMod)) {
      return false;
    }
    if (swapSlot === 2 && (rar.drifItem1?.psychoMod !== drif.psychoMod && rar.drifItem3?.psychoMod !== drif.psychoMod)) {
      return false;
    }
    if (swapSlot === 3 && (rar.drifItem1?.psychoMod !== drif.psychoMod && rar.drifItem2?.psychoMod !== drif.psychoMod)) {
      return false;
    }

    return true;
  }

  private isElementalDamageDrif(drif: Drif | null) {
    if (!drif) {
      return false;
    }
    return drif.psychoMod === PsychoMod.EXTRA_COLD_DAMAGE || drif.psychoMod === PsychoMod.EXTRA_FIRE_DAMAGE || drif.psychoMod === PsychoMod.EXTRA_ENERGY_DAMAGE;
  }

  maximiseDrifLevels() {
    const rars = this.userRarsWithDrifs.find(rars => rars.name === this.activeBuild);
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
      this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.NOT_MAXIMISED"), "ok", {duration: 1500})
    }

  }

  getLeftPower(slot: string | InventorySlot, modSlot: number) {
    const rar = this.getActiveBuild()?.rarsWithDrifs?.find(rar => rar.slot === slot);
    if (!rar) {
      throw new Error("LEFT POWER RAR WITH DRIF NOT FOUND");
    }
    let leftPower = this.getPowerCapacityByRank(rar);
    const drif1 = rar.drifItem1;
    const drif2 = rar.drifItem2;
    const drif3 = rar.drifItem3;
    if (drif1 != null && modSlot != 1) {
      leftPower -= this.drifService.getDrifPower(drif1.startPower, drif1.level || 1);
    }
    if (drif2 != null && modSlot != 2) {
      leftPower -= this.drifService.getDrifPower(drif2.startPower, drif2.level || 1);
    }
    if (drif3 != null && modSlot != 3) {
      leftPower -= this.drifService.getDrifPower(drif3.startPower, drif3.level || 1);
    }
    return leftPower;
  }

  printUsedCapacity(rarWithDrifs: RarWithDrifs): string {
    const cap = this.getPowerCapacityByRank(rarWithDrifs);
    const usedPower = this.countUsedPower(rarWithDrifs);
    const leftPower = cap - usedPower;
    return leftPower + "/" + cap;
  }

  getPowerCapacityByRank(rar: RarWithDrifs): number {
    if (rar.rank > 12) {
      return 0;
    }
    let capacity = rarsCapacity.find(cap => cap.rank == rar.rank)?.capacity;
    if (!capacity) {
      return 0;
    }
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

  getButtonColorClassByIfSwapMode(rar: RarWithDrifs, slot: number): string {
    if (!this.swappingMode || !this.swapDrif) {
      return "";
    }
    const drifFromSlotOne = this.getDrifFromSlot(this.swapDrif.item, this.swapDrif.slot);
    const drifFromSlotTwo = this.getDrifFromSlot(rar, slot);
    const canBeSwappedOne = this.canBeSwapped(drifFromSlotOne, rar, slot);
    const canBeSwappedTwo = this.canBeSwapped(drifFromSlotTwo, this.swapDrif.item, this.swapDrif.slot);

    const sameItem = this.swapDrif.item === rar;

    if ((!canBeSwappedOne || !canBeSwappedTwo) && !sameItem) {
      return "no-swap";
    }

    return "";
  }

  getButtonColorClassByDrifCategory(drif: Drif, rar: RarWithDrifs, slot: number): string {
    let classes: string;
    switch (drif.category) {
      case DrifCategory.REDUCTION: {
        classes = drif.shortName === this.illuminatedMod ? "reductionDrif illuminate" : "reductionDrif";
        break;
      }
      case DrifCategory.DAMAGE: {
        classes = drif.shortName === this.illuminatedMod ? "damageDrif illuminate" : "damageDrif";
        break;
      }
      case DrifCategory.SPECIAL: {
        classes = drif.shortName === this.illuminatedMod ? "specialDrif illuminate" : "specialDrif";
        break;
      }
      case DrifCategory.DEFENCE: {
        classes = drif.shortName === this.illuminatedMod ? "defenceDrif illuminate" : "defenceDrif";
        break;
      }
      case DrifCategory.ACCURACY: {
        classes = drif.shortName === this.illuminatedMod ? "accuracyDrif illuminate" : "accuracyDrif";
        break;
      }
    }

    if (this.swappingMode && this.swapDrif && this.swapDrif.slot === slot && this.swapDrif.item === rar) {
      classes = classes + " swap";
    }

    const swapModeColor = this.getButtonColorClassByIfSwapMode(rar, slot);

    classes = classes + " " + swapModeColor;

    return classes;
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
    if (summary.mod === PsychoMod.EXTRA_AP || summary.mod === PsychoMod.EXTRA_ATTACK_CIRCLE) {
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

  @HostListener("window:beforeunload") unloadHandler() {
    this.saveBuild(this.activeBuild);
  }

  saveBuild(name: string) {
    if (!this.drifs || this.drifs.length === 0) {
      return;
    }
    const currentRars = this.userRarsWithDrifs.find(rars => rars.name === name);
    const dataArray = localStorage.getItem('drif-simulator-array');
    if (!dataArray) {
      localStorage.setItem('drif-simulator-array', JSON.stringify(this.userRarsWithDrifs, function replacer(key, value) {
        return value;
      }));
    }

    if (!currentRars) {
      console.log("CURRENT RARS NULL");
      return;
    }

    let parse: UserRarsWithDrifs[];
    if (dataArray) {
      parse = JSON.parse(dataArray);
    } else {
      parse = this.userRarsWithDrifs;
    }

    const tempParsedRars = parse.find(rars => rars.name === name);
    if (!tempParsedRars) {
      console.log('tempParsedRars null')
      return;
    }

    tempParsedRars.rarsWithDrifs = currentRars.rarsWithDrifs;
    tempParsedRars.critEpicModLevel = currentRars.critEpicModLevel;
    tempParsedRars.dedicatedEpicModLevel = currentRars.dedicatedEpicModLevel;

    localStorage.setItem("drif-simulator-array", JSON.stringify(parse, function replacer(key, value) {
      return value;
    }));
  }

  load() {
    const data = localStorage.getItem('drif-simulator');
    if (data != null) {
      const tempRars = this.userRarsWithDrifs.find(rars => rars.name === 'temp');
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
    const dataArray = localStorage.getItem('drif-simulator-array');
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
    const activeBuild = this.userRarsWithDrifs.find(userRars => userRars.name === this.activeBuild);
    const buildToClone = this.userRarsWithDrifs.find(userRars => userRars.name === this.buildToClone);
    if (activeBuild && buildToClone) {
      const clonedBuild = cloneDeep(buildToClone);
      activeBuild.rarsWithDrifs = clonedBuild.rarsWithDrifs;
      activeBuild.dedicatedEpicModLevel = clonedBuild.dedicatedEpicModLevel;
      activeBuild.critEpicModLevel = clonedBuild.critEpicModLevel;
      this.calculateModSummary();
      this.buildToClone = "";
    }
  }

  drop(event: CdkDragDrop<DragDrifItem[], any>, slot: InventorySlot) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.moveDrifInSameItem(event.container.data, slot);
    }/* else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }*/
  }

  moveDrifInSameItem(dragDrifs: DragDrifItem[], slot: InventorySlot) {
    if (this.swappingMode && this.swapDrif) {
      this.snackBar.open("Podczas swapowania nie można przesuwać drifów w pionie", "ok", {duration: 2000});
      return;
    }
    const activeBuild = this.getActiveBuild();
    const rar = activeBuild.rarsWithDrifs.find(r => r.slot === slot);
    if (!rar) {
      console.log("RAR NULL")
      return;
    }
    dragDrifs.forEach((dd, index) => {
      this.changeDrifOnItem(rar, dd.drif, index);
    })
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

  getDragDrifItemArray(eq: RarWithDrifs) {
    return [
      {
        drif: eq.drifItem1,
        fromSlot: 0,
        inventorySlot: eq.slot
      },
      {
        drif: eq.drifItem2,
        fromSlot: 1,
        inventorySlot: eq.slot
      },
      {
        drif: eq.drifItem3,
        fromSlot: 2,
        inventorySlot: eq.slot
      }
    ] as DragDrifItem[];
  }

  protected readonly Array = Array;

  switchSwappingMode() {
    this.swappingMode = !this.swappingMode;
    this.swapDrif = null;
  }
}

import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import drifTiers from "@models/drif/data/drifTier";
import amountReduction from "@models/drif/data/amountDrifReduction";
import rarsCapacity from "@models/drif/data/rarCapacity";
import {RarWithDrifs} from "@models/drif/rarWithDrifs";
import {DrifSelectComponent} from "./drif-select/drif-select.component";
import {ModSummary} from "@models/drif/modSummary";
import modCaps from "@models/drif/data/modCap";
import {EpicDedicatedMod} from "@models/drif/epicDedicatedMod";
import {DrifBuild} from "@models/drif/drifBuild";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {DragDrifItem} from "@models/drif/dragDrifItem";
import {clone, cloneDeep, isEqual, isNumber} from "lodash-es";
import {PsychoMod} from "@models/items/psychoMod";
import {TranslateService} from "@ngx-translate/core";
import {DrifService} from "@services/user/drif/drif.service";
import {DrifCategory} from "@models/drif/drifCategory";
import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";
import {SwapDrifItem} from "@models/drif/swapDrifItem";
import {JwtService} from "@services/jwt/jwt.service";
import {DrifBuildService} from "@services/user/drif-build/drif-build.service";
import {DrifBuildDto} from "@models/drif/drifBuildDto";
import {DrifDto} from "@models/drif/drifDto";
import {RarWithDrifsDto} from "@models/drif/rarWithDrifsDto";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HasUnsavedChanges} from "@app/guards/unsaved-changes.guard";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {
  CreateBuildDialogComponent
} from "@app/components/user/drif-simulator/create-build-dialog/create-build-dialog.component";

@Component({
  selector: 'app-drif-simulator',
  templateUrl: './drif-simulator.component.html',
  styleUrls: ['./drif-simulator.component.scss'],
  standalone: false
})
export class DrifSimulatorComponent implements OnInit, OnDestroy, HasUnsavedChanges {

  protected readonly Number = Number;
  protected readonly DrifCategory = DrifCategory;
  protected readonly InventorySlot = InventorySlot;

  @ViewChild('dbBuildSelect') dbBuildSelect!: MatSelect;

  drifSlots = [1, 2, 3];

  modSummary: ModSummary[] = [];
  illuminatedMod: string = "";
  activeBuild: string = "temp";
  buildToClone: string | undefined = "";
  drifs: Drif[] = [];
  epicsMods: EpicDedicatedMod[] = [];
  buildNames: string[] = ["temp", "build 1", "build 2", "build 3", "build 4", "build 5", "build 6", "build 7", "build 8", "build 9"]
  drifBuilds: DrifBuild[] = [];
  dbBuilds: DrifBuild[] = [];
  activeDbBuild: number = 0;
  swappingMode = false;
  swapDrif: SwapDrifItem | null = null;
  lastUsedTier: number = 1;

  buildOnLoad!: DrifBuild;
  buildChanged: boolean = false;
  canUpdateOnServer: boolean = true;


  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    protected drifService: DrifService,
    protected jwtService: JwtService,
    private drifBuildSerivce: DrifBuildService
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
    this.updateBuild();
  }

  hasUnsavedChanges(): boolean {
    if (this.activeDbBuild !== 0) {
      const buildChanged = !isEqual(this.buildOnLoad, this.getActiveBuild());
      if (!buildChanged) {
        return false;
      }
      return this.buildChanged;
    }
    return false;
  }

  fillUserRars() {
    this.drifBuilds.forEach(rars => rars.rarsWithDrifs = this.generateRarsWithDrifsTemplate());
  }

  resetBuild() {
    const build = this.getActiveBuild();

    if (!build) {
      return;
    }
    build.critEpicModLevel = 1;
    build.dedicatedEpicModLevel = 1;
    build.rarsWithDrifs.forEach(rar => {
      this.overrideRarWithDrifs(rar);
    })

    this.calculateModSummary();
  }

  overrideRarWithDrifs(rar: RarWithDrifs, override?: RarWithDrifs) {
    if (override) {
      override.drifItems.forEach(drifItem => {
        drifItem.dbId = undefined;
      })
    }
    rar.drifItems = override?.drifItems || [];
    rar.rank = override?.rank || 2;
    rar.ornaments = override?.ornaments || 1;
    rar.sidragaBoost = override?.sidragaBoost || false;
    rar.epikBoost = override?.epikBoost || false;

  }

  clearBuild() {
    const build = this.getActiveBuild();
    build.rarsWithDrifs.forEach(rar => {
      rar.drifItems = [];
    })

    this.calculateModSummary();
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
        drifItems: []
      })
    })
    return rarsWithDrifsTemplate;
  }

  generateUserRarsWithDrifs() {
    this.buildNames.forEach(n => {
      this.drifBuilds.push({
        name: n,
        rarsWithDrifs: [],
        critEpicModLevel: 16,
        dedicatedEpicModLevel: 16,
        backpack: []
      })
    })
  }

  getActiveBuild() {
    if (this.activeDbBuild !== 0) {
      const dbBuild = this.dbBuilds.find(b => b.id === this.activeDbBuild);
      if (!dbBuild) {
        throw new Error("Db build not found.");
      }
      return dbBuild;
    }
    const find = this.drifBuilds.find(rars => rars.name === this.activeBuild);
    if (!find) {
      throw "NOT FOUND ACTIVE BUILD";
    }
    return find;
  }

  setActiveBuild(name: string, force?: boolean) {
    if (!force) {
      const hasChanges = this.hasUnsavedChanges();
      if (hasChanges) {
        const shouldLeave = window.confirm("Masz niezapisane zmiany, chcesz kontynuować?");
        if (!shouldLeave) {
          return;
        }
      }
    }

    this.updateBuild();
    this.activeDbBuild = 0;
    this.activeBuild = name;
    this.swappingMode = false;
    this.swapDrif = null;
    this.buildChanged = false;

    if (this.dbBuildSelect) {
      this.dbBuildSelect.value = 0;
    }

    this.calculateModSummary();
  }

  doSwap(secondRar: RarWithDrifs | undefined, secondDrifSlot: number): void {
    if (!this.swapDrif) {
      this.swapDrif = {
        slot: secondDrifSlot,
        item: secondRar
      }
      return;
    }

    const firstDrif = cloneDeep(this.getDrifFromRarBySlot(this.swapDrif.item, this.swapDrif.slot));
    const secondDrif = cloneDeep(this.getDrifFromRarBySlot(secondRar, secondDrifSlot));

    const swapTestOne = this.canBeSwapped(secondDrif, this.swapDrif.item, this.swapDrif.slot);
    const swapTestTwo = this.canBeSwapped(firstDrif, secondRar, secondDrifSlot);

    const sameItem = this.swapDrif.item === secondRar;

    if (!sameItem && (!swapTestOne || !swapTestTwo)) {
      this.snackBar.open("Zamiana tych drifów nie jest dozwolona", "ok", {duration: 1500});
      return;
    }

    this.drifBackPackSwap(this.swapDrif.item, firstDrif, secondRar, secondDrif);

    this.doAssignDrifToItem(this.swapDrif.item, secondDrif, this.swapDrif.slot);
    this.doAssignDrifToItem(secondRar, firstDrif, secondDrifSlot);

    this.swapDrif = null;

    this.calculateModSummary();
  }

  drifBackPackSwap(rar1: RarWithDrifs | undefined, drif1: Drif | null, rar2: RarWithDrifs | undefined, drif2: Drif | null): void {
    const backpackSwap = (!rar1 && rar2) || (!rar2 && rar1);
    if (!backpackSwap) {
      return;
    }

    if (drif2) {
      drif2.dbId = undefined;
    }
    if (drif1) {
      drif1.dbId = undefined;
    }
  }

  canBeSwapped(drif: Drif | null, rar: RarWithDrifs | undefined, slot: number): boolean {
    if (!this.swapDrif || !rar) {
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

  getDrifFromBackpack(slot: number): Drif {
    return this.getActiveBuild().backpack[slot];
  }

  openDrifDialog(rar: RarWithDrifs | undefined, drifSlot: number): void {
    if (this.swappingMode) {
      this.doSwap(rar, drifSlot);
      return;
    }

    const build = this.getActiveBuild();

    if (!rar) {
      if (build.backpack.length >= 100) {
        this.snackBar.open("Max drifów w plecaku to 100", "ok", {duration: 2000});
        return;
      }
    }

    const drif = this.getDrifFromRarBySlot(rar, drifSlot);
    const dialogRef = this.dialog.open(DrifSelectComponent, {
      autoFocus: false,
      width: '1000px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      data: {
        leftPower: rar ? this.getLeftPower(rar.slot, drifSlot) : 36,
        rarRank: rar ? rar.rank : 12,
        drifSlot: drifSlot,
        drifTier: rar ? this.getDrifTier(rar, drifSlot) : drif ? drif.tier : 0,
        drifLevel: rar ? this.getDrifLevel(rar, drifSlot) : drif ? drif.level : 1,
        itemSlot: rar ? rar.slot : drifSlot,
        drifs: this.drifs,
        lastUsedTier: this.lastUsedTier,
      }
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if (!data) {
          return;
        }

        if (data.newLevel) {
          const changed = this.changeModLevelAnItem(rar, drifSlot, data.newLevel, data.newTier);
          if (!changed) {
            return;
          }
          this.updateBuild();
          this.calculateModSummary();
          this.markAsChanged();
          return;
        }
        if (data.removeMod) {
          this.removeModFromItem(rar, drifSlot);
          this.calculateModSummary();
          this.updateBuild();
          this.markAsChanged();
          return;
        }
        const changed = this.assignDrifToItem(data.drif, rar, drifSlot);
        if (!changed) {
          return;
        }
        if (data.drif.tier) {
          this.lastUsedTier = data.drif.tier;
        }
        this.calculateModSummary();
        this.markAsChanged();
        this.updateBuild();
      }
    );
  }

  getDrifFromRarBySlot(rar: RarWithDrifs | undefined, slot: number) {
    if (!rar) {
      return this.getDrifFromBackpack(slot);
    }
    return rar.drifItems.find(d => d.drifSlot === slot) ?? null;
  }

  removeDrifFromRarBySlot(rar: RarWithDrifs, slot: number) {
    rar.drifItems = rar.drifItems.filter(d => d.drifSlot !== slot);
  }

  removeModFromItem(rar: RarWithDrifs | undefined, slot: number) {
    if (!rar) {
      this.getActiveBuild().backpack.splice(slot, 1);
      return;
    }
    this.removeDrifFromRarBySlot(rar, slot);
  }

  changeModLevelAnItem(rarWithDrifs: RarWithDrifs | undefined, drifSlot: number, level: number, tier: number) {
    if (!rarWithDrifs) {
      const drifFromBackpack = this.getDrifFromBackpack(drifSlot);
      if (!drifFromBackpack) {
        return false;
      }
      if (drifFromBackpack.level === level && drifFromBackpack.tier === tier) {
        return false;
      }
      drifFromBackpack.level = level;
      drifFromBackpack.tier = tier;
      return true;
    }
    const drif = this.getDrifFromRarBySlot(rarWithDrifs, drifSlot);

    if (!drif) {
      return false;
    }

    if (drif.level === level && drif.tier === tier) {
      return false;
    }

    this.doChangeModLevelAnItem(drif, rarWithDrifs, level, tier);
    return true;
  }

  private doChangeModLevelAnItem(drif: Drif | null, rarWithDrifs: RarWithDrifs, level: number, tier: number) {
    if (!drif) {
      return;
    }

    const oldLevel = clone(drif.level);
    const oldTier = clone(drif.tier);
    drif.level = level;
    drif.tier = tier;
    if (this.countUsedPower(rarWithDrifs) > this.getPowerCapacityByRank(rarWithDrifs)) {
      drif.level = oldLevel;
      drif.tier = oldTier;
    }
    if (drif.tier) {
      this.lastUsedTier = drif.tier;
    }
  }

  calculateModSummary() {
    this.removeDuplicatesKeepFirst();
    this.validateRanks();
    this.validateLevels();
    this.modSummary = [];
    const activeBuild = this.getActiveBuild();
    activeBuild.rarsWithDrifs.forEach(rar => {
      if (rar.rank > 12) {
        this.calculateEpicMod(rar, activeBuild);
        return;
      }
      rar.drifItems.forEach(d => {
        this.countMod(d, rar.ornaments, rar.sidragaBoost, false, rar.epikBoost);
      })
      if (rar.epikBoost && rar.rank === 12) {
        this.addExtraApToSummary(true);
      }
    });

    this.calculateRealModSum();

    this.getActiveBuild().rarsWithDrifs.forEach(rar => {
      if (rar.drifItems.length > 3) {
        console.log("ERROR: " + rar.slot)
      }
    })
  }

  removeDuplicatesKeepFirst() {
    const rars = this.getActiveBuild().rarsWithDrifs;

    rars.forEach(item => {
      const seen = new Set<number>();
      const filteredDrifs = item.drifItems.filter(d => {
        if (seen.has(d.drifSlot || 0)) {
          return false;
        }
        seen.add(d.drifSlot || 0);
        return true;
      });
      if (item.drifItems.length !== filteredDrifs.length) {
        item.drifItems = filteredDrifs;
        this.snackBar.open("Naprawiono zbugowane drify na przedmicie: " + this.translate.instant('ITEMS.TYPES.' + item.slot), "ok", {duration: 3000});
      }
    });
  }

  private validateLevels() {
    this.getActiveBuild().rarsWithDrifs.forEach(rar => {
      const drif1 = this.getDrifFromRarBySlot(rar, 1);
      const drif2 = this.getDrifFromRarBySlot(rar, 2);
      const drif3 = this.getDrifFromRarBySlot(rar, 3);
      const drifMaxLevel1 = this.getDrifMaxLevel(drif1);
      const drifMaxLevel2 = this.getDrifMaxLevel(drif2);
      const drifMaxLevel3 = this.getDrifMaxLevel(drif3);
      if (drif1 && this.getDrifLevel(rar, 1) > drifMaxLevel1) {
        drif1.level = drifMaxLevel1;
      }
      if (drif2 && this.getDrifLevel(rar, 2) > drifMaxLevel2) {
        drif2.level = drifMaxLevel2;
      }
      if (drif3 && this.getDrifLevel(rar, 3) > drifMaxLevel3) {
        drif3.level = drifMaxLevel3;
      }
    })
  }

  private validateRanks() {
    this.getActiveBuild().rarsWithDrifs.forEach(rar => {
      if (rar.rank < 10) {
        this.removeDrifFromRarBySlot(rar, 3);
      }
      if (rar.rank < 4 && rar.ornaments < 7) {
        this.removeDrifFromRarBySlot(rar, 2);
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

  calculateEpicMod(rar: RarWithDrifs, userConfig: DrifBuild) {
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
    const drif = this.getDrifFromRarBySlot(rar, slot);
    if (!drif || !drif.tier) {
      return 0;
    }
    return drif.tier;
  }

  private getDrifLevel(rar: RarWithDrifs, slot: number): number {
    const drif = this.getDrifFromRarBySlot(rar, slot);
    if (!drif || !drif.level) {
      return 1;
    }
    return drif.level;
  }

  countUsedPower(eq: RarWithDrifs) {
    const drif1 = this.getDrifFromRarBySlot(eq, 1);
    const drif2 = this.getDrifFromRarBySlot(eq, 2);
    const drif3 = this.getDrifFromRarBySlot(eq, 3);

    return this.drifService.countUsedPower(drif1, drif2, drif3, eq.ornaments, eq.rank)
  }

  private assignDrifToItem(drif: Drif | null, rar: RarWithDrifs | undefined, slot: number) {
    if (!drif) {
      this.removeModFromItem(rar, slot);
      return true;
    }
    const drif1 = this.getDrifFromRarBySlot(rar, 1);
    const drif2 = this.getDrifFromRarBySlot(rar, 2);
    const drif3 = this.getDrifFromRarBySlot(rar, 3);
    if (this.isElementalDamageDrif(drif) && rar) {
      if (slot === 1 && (this.isElementalDamageDrif(drif2) || this.isElementalDamageDrif(drif3))) {
        this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_LIMITED"), "ok", {duration: 1500});
        return false;
      }
      if (slot === 2 && (this.isElementalDamageDrif(drif1) || this.isElementalDamageDrif(drif3))) {
        this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_LIMITED"), "ok", {duration: 1500});
        return false;
      }
      if (slot === 3 && (this.isElementalDamageDrif(drif1) || this.isElementalDamageDrif(drif2))) {
        this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_LIMITED"), "ok", {duration: 1500});
        return false;
      }
    }

    const containsThatMod = rar ? this.itemContainsThatMod(drif, rar, slot) : false;
    if (!containsThatMod) {
      return this.doAssignDrifToItem(rar, drif, slot);
    }

    this.snackBar.open(this.translate.instant("DRIF_SIMULATOR.MOD_EXIST", {name: drif.shortName}), "ok", {duration: 1500});
    return false;
  }

  private doAssignDrifToItem(rar: RarWithDrifs | undefined, drif: Drif | null, slot: number) {
    if (!rar) {
      const activeBuild = this.getActiveBuild();
      if (!drif) {
        activeBuild.backpack.splice(slot, 1);
        return true;
      }
      const oldDrif = activeBuild.backpack[slot];
      const drifsIdentical = this.drifsSameLevelAndTierMod(drif, oldDrif);

      if (drifsIdentical) {
        return false;
      }
      activeBuild.backpack.splice(slot, 1, drif);
      return true;
    }
    const oldDrif = this.getDrifFromRarBySlot(rar, slot);

    const drifsIdentical = this.drifsSameLevelAndTierMod(drif, oldDrif);

    if (drifsIdentical) {
      return false;
    }
    this.removeDrifFromRarBySlot(rar, slot);

    if (!drif) {
      return true;
    }

    drif.drifSlot = slot;
    rar.drifItems.push(cloneDeep(drif));

    return true;
  }

  drifsSameLevelAndTierMod(drif1: Drif | null | undefined, drif2: Drif | null | undefined) {
    return drif1?.tier === drif2?.tier && drif1?.level === drif2?.level && drif1?.psychoMod === drif2?.psychoMod;
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
    const drif1 = this.getDrifFromRarBySlot(rar, 1);
    const drif2 = this.getDrifFromRarBySlot(rar, 2);
    const drif3 = this.getDrifFromRarBySlot(rar, 3);
    if (swapSlot === 1 && (drif2?.psychoMod !== drif.psychoMod && drif3?.psychoMod !== drif.psychoMod)) {
      return false;
    }
    if (swapSlot === 2 && (drif1?.psychoMod !== drif.psychoMod && drif3?.psychoMod !== drif.psychoMod)) {
      return false;
    }
    if (swapSlot === 3 && (drif1?.psychoMod !== drif.psychoMod && drif2?.psychoMod !== drif.psychoMod)) {
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
    const build = this.getActiveBuild();
    if (!build) {
      return;
    }
    build.rarsWithDrifs.forEach(rar => {
      const drif1 = this.getDrifFromRarBySlot(rar, 1);
      const drif2 = this.getDrifFromRarBySlot(rar, 2);
      const drif3 = this.getDrifFromRarBySlot(rar, 3);
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
    build.critEpicModLevel = 16;
    build.dedicatedEpicModLevel = 16;
    this.calculateModSummary();

  }

  private doMaximiseLevel(drif: Drif, rar: RarWithDrifs | undefined) {
    const tier = drifTiers.find(drifTier => drifTier.tier === drif.tier);
    if (!tier) {
      throw new Error("FATAL ERROR: Tier not found")
    }
    const oldLevel = clone(drif.level);
    drif.level = tier.maxDrifLevel;
    if (rar && (this.countUsedPower(rar) > this.getPowerCapacityByRank(rar))) {
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
    const drif1 = this.getDrifFromRarBySlot(rar, 1);
    const drif2 = this.getDrifFromRarBySlot(rar, 2);
    const drif3 = this.getDrifFromRarBySlot(rar, 3);
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

  getButtonColorClassByIfSwapMode(rar: RarWithDrifs | undefined, slot: number): string {
    if (!this.swappingMode || !this.swapDrif || !rar) {
      return "";
    }
    const drifFromSlotOne = this.getDrifFromRarBySlot(this.swapDrif.item, this.swapDrif.slot);
    const drifFromSlotTwo = this.getDrifFromRarBySlot(rar, slot);
    const canBeSwappedOne = this.canBeSwapped(drifFromSlotOne, rar, slot);
    const canBeSwappedTwo = this.canBeSwapped(drifFromSlotTwo, this.swapDrif.item, this.swapDrif.slot);

    const sameItem = this.swapDrif.item === rar;

    if ((!canBeSwappedOne || !canBeSwappedTwo) && !sameItem) {
      return "no-swap";
    }

    return "";
  }

  getButtonColorClassByDrifCategory(drif: Drif | null, rar: RarWithDrifs | undefined, slot: number): string {
    if (!drif) {
      return "";
    }
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

  @HostListener("window:beforeunload") unloadHandler(event: BeforeUnloadEvent) {
    const hasChanges = this.hasUnsavedChanges();
    if (hasChanges) {
      event.preventDefault();
      return;
    }

    this.updateBuild();
  }

  updateBuildOnServer() {
    const canBeProcessed = this.canBeProcessed();

    if (!canBeProcessed) {
      return;
    }

    const activeBuild = this.getActiveBuild();

    if (this.activeDbBuild === 0 || !activeBuild.id) {
      this.snackBar.open("Nie możesz zaktualizować niezapisanego buildu!", "ok", {duration: 3000})
      return;
    }

    this.canUpdateOnServer = false;

    this.drifBuildSerivce.updateBuild(activeBuild)
      .subscribe({
        next: result => {
          const build = this.mapDrifBuildsDtoToDrifBuilds([result])[0]; //allways one build
          const index = this.dbBuilds.indexOf(activeBuild);

          this.dbBuilds.splice(index, 1, build);

          this.buildChanged = false;
          this.sortBackpack();

          this.snackBar.open("Build zaktualizowany.", "ok", {duration: 3000});

        },
        error: error => {
          if (!error.error.message) {
            this.snackBar.open("Wystąpił błąd, spróbuj ponownie za chwilę.", "ok", {duration: 3000});
            return;
          }
          this.snackBar.open(error.error.message, "ok", {duration: 3000});
          setTimeout(() => {
            this.canUpdateOnServer = true;
          }, 2500);
        },
        complete: () => {
          setTimeout(() => {
            this.canUpdateOnServer = true;
          }, 2500);
        }
      })
  }

  CreateOrRenameBuild(rename: boolean) {
    if (!rename && this.hasUnsavedChanges()) {
      const shouldLeave = window.confirm("Masz niezapisane zmiany, chcesz kontynuować?");
      if (!shouldLeave) {
        return;
      }
    }

    const activeBuild = this.getActiveBuild();
    const dialog = this.dialog.open(CreateBuildDialogComponent, {
      width: '35vw',
      maxWidth: '35vw',
      data: {name: rename ? activeBuild.name : null},
    });

    dialog.afterClosed()
      .subscribe(result => {
        if (result) {
          const name = result.buildName as string;
          if (name.length > 60) {
            this.snackBar.open("Nazwa zbyt długa!", "ok", {duration: 3000});
            return;
          }
          if (!rename) {
            this.doCreateBuildOnServer(name);
            this.sortBackpack();
            this.calculateModSummary();
            return;
          }

          const build = activeBuild;
          build.name = name;
          this.updateBuildOnServer();

        }
      })
  }

  doCreateBuildOnServer(name: string) {
    const canBeProcessed = this.canBeProcessed();

    if (!canBeProcessed) {
      return;
    }

    const newBuild: DrifBuild = {
      backpack: [],
      critEpicModLevel: 0,
      dedicatedEpicModLevel: 0,
      name: name,
      rarsWithDrifs: this.generateRarsWithDrifsTemplate()
    }

    this.drifBuildSerivce.createBuild(newBuild)
      .subscribe({
        next: result => {
          const drifBuild = this.mapDrifBuildsDtoToDrifBuilds([result])[0];
          this.dbBuilds.push(drifBuild);
          if (!drifBuild.id) {
            throw new Error("Updated build id not exist");
          }
          this.buildChanged = false;
          this.activeBuild = "";
          this.swappingMode = false;
          this.swapDrif = null;

          this.activeDbBuild = drifBuild.id;
          this.dbBuildSelect.value = drifBuild.id;
          this.buildOnLoad = cloneDeep(this.getActiveBuild());
          this.snackBar.open("Pomyślnie utworzony nowy build", "ok", {duration: 3000});
        },
        error: error => {
          if (!error.error.message) {
            this.snackBar.open("Wystąpił błąd, spróbuj ponownie za chwilę.", "ok", {duration: 3000});
            return;
          }
          this.snackBar.open(error.error.message, "ok", {duration: 3000});
        }
      })
  }

  canBeProcessed() {
    if (!this.drifs || this.drifs.length === 0) {
      this.snackBar.open("Build cannot be saved")
      return false;
    }

    const uuid = this.jwtService.getUuid();
    if (!uuid) {
      this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.NOT_LOGGED_IN"), "ok", {duration: 3000});
      return false;
    }
    return true;
  }

  markAsChanged() {
    this.buildChanged = true;
  }

  /**
   * Updating if current build is LOCAL
   */
  updateBuild() {
    if (this.activeDbBuild !== 0) {
      return;
    }
    this.saveLocalBuild();
  }

  saveLocalBuild(name?: string) {
    if (!name) {
      name = this.activeBuild;
    }

    if (!this.drifs || this.drifs.length === 0) {
      return;
    }

    const currentRars = this.drifBuilds.find(rars => rars.name === name);
    const dataArray = localStorage.getItem('drif-simulator-array');
    if (!dataArray) {
      localStorage.setItem('drif-simulator-array', JSON.stringify(this.drifBuilds, function replacer(key, value) {
        return value;
      }));
    }

    if (!currentRars) {
      console.log("CURRENT RARS NULL");
      return;
    }

    let parse: DrifBuild[];
    if (dataArray) {
      parse = JSON.parse(dataArray);
    } else {
      parse = this.drifBuilds;
    }

    const tempParsedRars = parse.find(rars => rars.name === name);
    if (!tempParsedRars) {
      console.log('tempParsedRars null')
      return;
    }

    tempParsedRars.rarsWithDrifs = currentRars.rarsWithDrifs;
    tempParsedRars.critEpicModLevel = currentRars.critEpicModLevel;
    tempParsedRars.dedicatedEpicModLevel = currentRars.dedicatedEpicModLevel;
    tempParsedRars.backpack = currentRars.backpack;

    localStorage.setItem("drif-simulator-array", JSON.stringify(parse, function replacer(key, value) {
      return value;
    }));
  }

  load() {
    const data = localStorage.getItem('drif-simulator');
    //OLD VERSION
    if (data != null) {
      const tempRars = this.drifBuilds.find(rars => rars.name === 'temp');
      if (!tempRars) {
        console.log("TEMP RARS NOT FOUND")
        return;
      }
      tempRars.rarsWithDrifs = JSON.parse(data);
      localStorage.removeItem("drif-simulator");
      this.saveLocalBuild('temp');
      this.calculateModSummary();
      return;
    }
    //NEW VERSION v1
    const dataArray = localStorage.getItem('drif-simulator-array');
    if (!dataArray) {
      return;
    }
    this.drifBuilds = JSON.parse(dataArray);
    this.drifBuilds.forEach(drifBuild => {
      drifBuild.rarsWithDrifs.forEach(r => {
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

        if (!drifBuild.backpack) {
          drifBuild.backpack = [];
        }

        this.patchSavedDrif(r);
      });
    });

    const item = localStorage.getItem('backuped-drifs');
    if (!item) {
      localStorage.setItem('backuped-drifs', JSON.stringify(this.drifBuilds, function replacer(key, value) {
        return value;
      }));
    }

    this.loadFromDbAndMap();

    this.calculateModSummary();
  }

  loadFromDbAndMap() {
    if (!this.jwtService.isLoggedIn()) {
      return;
    }
    this.drifBuildSerivce.getOwningBuilds()
      .subscribe({
        next: result => {
          this.dbBuilds = this.mapDrifBuildsDtoToDrifBuilds(result);
        },
        error: error => {

        }
      })
  }

  mapDrifBuildsDtoToDrifBuilds(builds: DrifBuildDto[]) {
    const drifBuilds: DrifBuild[] = [];

    builds.forEach(build => {

      const mappedBackpack = this.mapDtoDrifsToDrifs(build.backpack);
      const mappedRars = this.mapRarWithDrifsDtoToRarWithDrifs(build.rarsWithDrifs);

      const mappedBuild: DrifBuild = {
        id: build.id,
        critEpicModLevel: build.critEpicModLevel,
        dedicatedEpicModLevel: build.dedicatedEpicModLevel,
        name: build.name,
        owner: build.owner,
        backpack: mappedBackpack,
        rarsWithDrifs: mappedRars
      }
      this.drifBuildSerivce.sortRarWithDrifsBySlot(mappedBuild.rarsWithDrifs);
      drifBuilds.push(mappedBuild);
    });

    return drifBuilds;
  }

  mapRarWithDrifsDtoToRarWithDrifs(rars: RarWithDrifsDto[]) {
    const mappedRars: RarWithDrifs[] = [];

    rars.forEach(rar => {
      const mappedRar: RarWithDrifs = {
        id: rar.id,
        drifItems: this.mapDtoDrifsToDrifs(rar.drifItems),
        epikBoost: rar.epikBoost,
        ornaments: rar.ornaments,
        rank: rar.rank,
        sidragaBoost: rar.sidragaBoost,
        slot: rar.slot,
      }
      mappedRars.push(mappedRar);
    })
    return mappedRars;
  }

  mapDtoDrifsToDrifs(dtoDrifs: DrifDto[]) {
    const mappedBackpack: Drif[] = [];

    dtoDrifs.forEach(dtoDrif => {
      const drif = this.mapDtoDrifToDrif(dtoDrif);
      return mappedBackpack.push(drif);
    });

    return mappedBackpack;
  }

  mapDtoDrifToDrif(dtoDrif: DrifDto) {
    const realDrif = this.drifs.find(dbDrif => dbDrif.id === dtoDrif.drifId);
    if (!realDrif) {
      throw new Error(`Drif ${dtoDrif.drifId} not found`);
    }
    const mappedDrif: Drif = {
      category: realDrif.category,
      drifSlot: dtoDrif.drifSlot,
      forRemoval: realDrif.forRemoval,
      id: realDrif.id,
      dbId: dtoDrif.id,
      level: dtoDrif.level,
      psychoGrowByLevel: realDrif.psychoGrowByLevel,
      psychoMod: realDrif.psychoMod,
      shortName: realDrif.shortName,
      startPower: realDrif.startPower,
      tier: dtoDrif.tier,
    }
    return mappedDrif;
  }

  patchSavedDrif(rar: RarWithDrifs) {
    if (!rar.drifItems) {
      rar.drifItems = [];
      this.patchOldSavedDrifs(rar);
      return;
    }
    rar.drifItems.forEach(rarDrif => {
      const dbDrif = this.drifs.find(d => d.id === rarDrif?.id);
      if (!dbDrif) {
        this.removeDrifFromRarBySlot(rar, rarDrif.drifSlot ?? 0)
      } else {
        rarDrif.category = dbDrif.category;
        rarDrif.psychoGrowByLevel = dbDrif.psychoGrowByLevel;
        rarDrif.psychoMod = dbDrif.psychoMod;
        rarDrif.shortName = dbDrif.shortName;
        rarDrif.startPower = dbDrif.startPower;
        rarDrif.forRemoval = dbDrif.forRemoval;
      }
    });


  }

  patchOldSavedDrifs(rar: RarWithDrifs) {
    rar.drifItem1;
    if (rar.drifItem1) {
      const dbDrif = this.drifs.find(d => d.id === rar.drifItem1?.id);
      if (!dbDrif) {
        rar.drifItem1 = null;
      } else {
        rar.drifItem1.category = dbDrif.category;
        rar.drifItem1.psychoGrowByLevel = dbDrif.psychoGrowByLevel;
        rar.drifItem1.psychoMod = dbDrif.psychoMod;
        rar.drifItem1.shortName = dbDrif.shortName;
        rar.drifItem1.startPower = dbDrif.startPower;
        rar.drifItem1.forRemoval = dbDrif.forRemoval;
        rar.drifItem1.drifSlot = 1;
        rar.drifItems.push(cloneDeep(rar.drifItem1));
      }
    }
    if (rar.drifItem2) {
      const dbDrif = this.drifs.find(d => d.id === rar.drifItem2?.id);
      if (!dbDrif) {
        rar.drifItem2 = null;
      } else {
        rar.drifItem2.category = dbDrif.category;
        rar.drifItem2.psychoGrowByLevel = dbDrif.psychoGrowByLevel;
        rar.drifItem2.psychoMod = dbDrif.psychoMod;
        rar.drifItem2.shortName = dbDrif.shortName;
        rar.drifItem2.startPower = dbDrif.startPower;
        rar.drifItem2.forRemoval = dbDrif.forRemoval;
        rar.drifItem2.drifSlot = 2;
        rar.drifItems.push(cloneDeep(rar.drifItem2));
      }
    }
    if (rar.drifItem3) {
      const dbDrif = this.drifs.find(d => d.id === rar.drifItem3?.id);
      if (!dbDrif) {
        rar.drifItem3 = null;
      } else {
        rar.drifItem3.category = dbDrif.category;
        rar.drifItem3.psychoGrowByLevel = dbDrif.psychoGrowByLevel;
        rar.drifItem3.psychoMod = dbDrif.psychoMod;
        rar.drifItem3.shortName = dbDrif.shortName;
        rar.drifItem3.startPower = dbDrif.startPower;
        rar.drifItem3.forRemoval = dbDrif.forRemoval;
        rar.drifItem3.drifSlot = 3;
        rar.drifItems.push(cloneDeep(rar.drifItem3));
      }
    }
  }

  getSpecificBuild(name: string | undefined) {
    if (!name) {
      return undefined;
    }
    if (isNumber(name)) {
      const buildId = name as number;
      return this.dbBuilds.find(b => b.id === buildId);
    }
    return this.drifBuilds.find(userRars => userRars.name === this.buildToClone);
  }

  cloneBuild() {
    const activeBuild = this.getActiveBuild();
    const buildToClone = this.getSpecificBuild(this.buildToClone);
    if (activeBuild && buildToClone) {
      const clonedBuild = cloneDeep(buildToClone);
      activeBuild.rarsWithDrifs.forEach(rar => {
        const find = clonedBuild.rarsWithDrifs.find(r => r.slot === rar.slot);
        this.overrideRarWithDrifs(rar, find);
      });
      activeBuild.dedicatedEpicModLevel = clonedBuild.dedicatedEpicModLevel;
      activeBuild.critEpicModLevel = clonedBuild.critEpicModLevel;

      clonedBuild.backpack.forEach(d => {
        d.dbId = undefined;
      });
      activeBuild.backpack = clonedBuild.backpack;
      this.calculateModSummary();
    }

    setTimeout(() => {
      this.buildToClone = undefined;
    });
  }

  cloneBackpack() {
    const activeBuild = this.getActiveBuild();
    const buildToClone = this.getSpecificBuild(this.buildToClone);

    if (activeBuild && buildToClone) {
      const clonedBuild = cloneDeep(buildToClone);
      clonedBuild.backpack.forEach(d => {
        d.dbId = undefined;
      });
      activeBuild.backpack = clonedBuild.backpack;
      this.calculateModSummary();
    }

    setTimeout(() => {
      this.buildToClone = undefined;
    });
  }

  cloneRarsAndStars() {
    const activeBuild = this.getActiveBuild();
    const buildToClone = this.getSpecificBuild(this.buildToClone);

    if (activeBuild && buildToClone) {
      const clonedBuild = cloneDeep(buildToClone);

      clonedBuild.rarsWithDrifs.forEach(rar => {
        const find = activeBuild.rarsWithDrifs.find(r => r.slot === rar.slot);
        rar.drifItems = [];
        rar.id = find?.id;
      })

      activeBuild.rarsWithDrifs = clonedBuild.rarsWithDrifs;
      activeBuild.dedicatedEpicModLevel = clonedBuild.dedicatedEpicModLevel;
      activeBuild.critEpicModLevel = clonedBuild.critEpicModLevel;
      this.calculateModSummary();
    }

    setTimeout(() => {
      this.buildToClone = undefined;
    });
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
      this.doAssignDrifToItem(rar, cloneDeep(dd.drif), index + 1);
    });
    this.calculateModSummary();
  }

  getDragDrifItemArray(eq: RarWithDrifs) {
    const drif1 = this.getDrifFromRarBySlot(eq, 1);
    const drif2 = this.getDrifFromRarBySlot(eq, 2);
    const drif3 = this.getDrifFromRarBySlot(eq, 3);
    return [
      {
        drif: drif1,
        fromSlot: 0,
        inventorySlot: eq.slot
      },
      {
        drif: drif2,
        fromSlot: 1,
        inventorySlot: eq.slot
      },
      {
        drif: drif3,
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

  sortBackpack() {
    const backpack = this.getActiveBuild().backpack;
    backpack.sort((a, b) => {
      return a.category.localeCompare(b.category) || a.shortName.localeCompare(b.shortName) || (b.level ?? 0) - (a.level ?? 0);
    })
  }

  dropDrifsToBackpack() {
    const build = this.getActiveBuild();

    if (build.backpack.length >= 60) {
      this.snackBar.open("Max drifów w plecaku to 60", "ok", {duration: 2000});
      return;
    }

    build.rarsWithDrifs.forEach(rar => {
      build.backpack.push(...rar.drifItems);
      rar.drifItems = [];
    })

    this.calculateModSummary();
  }

  cloneDrifsToBackpack() {
    const build = this.getActiveBuild();

    if (build.backpack.length >= 60) {
      this.snackBar.open("Max drifów w plecaku to 60", "ok", {duration: 2000});
      return;
    }

    build.rarsWithDrifs.forEach(rar => {
      build.backpack.push(...rar.drifItems);
    })
  }

  maximiseBackpackDrifs() {
    const backpack = this.getActiveBuild().backpack;
    backpack.forEach(drif => {
      this.doMaximiseLevel(drif, undefined);
    })
  }

  disposeBackpackDrifs() {
    const build = this.getActiveBuild();

    build.backpack = [];
  }

  pushDbBuild(e: MatSelectChange) {
    if (this.hasUnsavedChanges()) {
      const shouldLeave = window.confirm("Masz niezapisane zmiany, chcesz kontynuować?");
      if (!shouldLeave) {
        e.source.value = this.activeDbBuild;
        return;
      }
    }

    this.activeDbBuild = e.value;

    this.buildChanged = false;
    this.activeBuild = "";
    this.swappingMode = false;
    this.swapDrif = null;
    this.buildOnLoad = cloneDeep(this.getActiveBuild());
    this.sortBackpack();
    this.calculateModSummary();
  }

  removeBuild() {
    const build = this.getActiveBuild();
    const accepted = window.confirm("Jesteś pewny, że chcesz usunąć ten build: " + build.name + "?");
    if (!accepted) {
      return;
    }
    const buildId = cloneDeep(this.activeDbBuild);
    if (!buildId) {
      throw new Error("Missing build id");
    }
    this.drifBuildSerivce.deleteBUild(buildId)
      .subscribe({
        next: () => {

          this.snackBar.open("Build poprawnie usunięty", "ok", {duration: 2000});
          this.setActiveBuild("temp", true);
          this.dbBuilds = this.dbBuilds.filter(b => b.id !== buildId);
        }
      })
  }
}

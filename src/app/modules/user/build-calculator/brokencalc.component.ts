import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Skill} from "./model/skill";
import {SkillCost} from "./model/skillCost";
import {MatDialog} from "@angular/material/dialog";
import {Statistic} from "./model/statistic";
import {Build} from "./model/build";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BuildCalculatorService} from "./build-calculator.service";
import {SkillBasic} from "./model/skillBasic";
import {SkillLevelSelectComponent} from "./skill-level-select/skill-level-select.component";
import {lastValueFrom, map, Subscription} from "rxjs";
import {SimpleBuild} from "./model/simpleBuild";
import {BuildSkillStatData} from "./model/buildSkillStatData";
import {SkillStatType} from "./model/skillStatType";
import {DatabaseBuild} from "./model/databaseBuild";
import {JwtService} from "../../../common/service/jwt.service";
import {MatButton} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {BuildLiker} from "./model/buildLiker";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {ProfileDto} from "./model/profileDto";
import {SkillPsychoEffect} from "./model/skillPsychoEffect";
import {SkillCustomEffect} from "./model/skillCustomEffect";
import {TranslateService} from "@ngx-translate/core";
import {Inventory} from "./model/inventory";
import {IncrustatedLegendaryItem} from "../rar-list/model/incrustatedLegendaryItem";
import {Orb} from "../../../common/model/orb/orb";
import {Drif} from "../../../common/model/drif/drif";
import {InventoryItem} from "./model/inventoryItem";
import {InventoryDrif} from "./model/inventoryDrif";
import {InventorySlot} from "./model/inventorySlot";
import {cloneDeep, floor} from "lodash-es";
import {ItemType} from "../../../common/model/items/itemType";
import {IncrustationTarget} from "../../../common/model/items/incrustationTarget";
import {MatSliderChange} from "@angular/material/slider";
import {ItemFamily} from "../../../common/model/items/itemFamily";
import {RarListIncrustationService} from "../rar-list/rar-list-incrustation.service";
import {UpgradeTarget} from "../../../common/model/items/upgradeTarget";
import resistances from "./model/resistances";
import deducedInventoryItemValuesTable from "./model/deducedInventoryItemValues";
import {ModSummary} from "../drif-simulator/model/modSummary";
import modCaps from "../drif-simulator/model/modCap";
import amountReduction from "../drif-simulator/model/amountDrifReduction";
import {DrifSumDialogComponent} from "./drif-sum-dialog/drif-sum-dialog.component";
import {PsychoMod} from "../../../common/model/psychoMod";
import {LocalDrif, LocalInventory, LocalItem} from "./model/localInventory";

@Component({
  selector: 'app-brokencalc',
  templateUrl: './brokencalc.component.html',
  styleUrls: ['./brokencalc.component.scss']
})
export class BrokencalcComponent implements OnInit, AfterViewInit, OnDestroy {

  protected readonly InventorySlot = InventorySlot;
  protected readonly ItemType = ItemType;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '450',
    maxHeight: 'auto',
    width: '800',
    minWidth: '400',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: '',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'removeFormat',
        'fontName',
        'heading',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'toggleEditorMode']
    ]
  };

  @ViewChild('saveButton') saveButton!: MatButton;
  @ViewChild('rar') rarRef!: ElementRef;
  @ViewChild('drifShow') drifLevelRef!: ElementRef;
  @ViewChild('drifDesc') drifDescRef!: ElementRef;
  @ViewChild('upgradeShow') upgradeDescRef!: ElementRef;

  //BUILD CALC
  buildName: string = "";
  shortDescription: string = "";
  privateBuild: boolean = false;
  pvpBuild: boolean = false;
  description: any;

  bbClassSkills: Skill[] = [];
  fmClassSkills: Skill[] = [];
  knClassSkills: Skill[] = [];
  drClassSkills: Skill[] = [];
  shClassSkills: Skill[] = [];
  vdClassSkills: Skill[] = [];
  arClassSkills: Skill[] = [];
  basicSkillsTemplate: Skill[] = [];
  statsTemplate: Statistic[] = [];
  skillCosts: SkillCost[] = [];

  currentBasicSkills: Skill[] = [];
  currentClassSkills: Skill[] = [];
  currentStats: Statistic[] = [];
  resetOnLevelChange: boolean = false;
  newLevel: string = "2";
  newClass: string = "BARBARIAN";
  level: number = 2;
  skillPoints: number = 0;
  remainingSkillPoints: number = 0;
  studentPoints: number = 0;
  adeptPoints: number = 0;
  masterPoints: number = 0;
  statPoints: number = 0;
  remainingStatsPoints: number = 0;
  activeSkillImageName: string = "bb1";
  activeSkill!: Skill;

  technicalRefresh: boolean = false;
  subscription!: Subscription;
  buildNotFound: boolean = false;
  databaseBuild!: DatabaseBuild;

  build: Build = {
    level: 0,
    currentClass: "BARBARIAN",
    currentBasicSkills: [],
    currentClassSkills: [],
    currentStatistics: []
  };

  //EQ CALC
  playerInventory: Inventory = {
    items: []
  };
  itemsFromDb!: IncrustatedLegendaryItem[];
  orbsFromDb!: Orb[];
  drifsFromDb!: Drif[];
  availableToChoose: IncrustatedLegendaryItem[] = [];
  unavailableToChoose: IncrustatedLegendaryItem[] = [];

  currentInventorySlot: InventorySlot = InventorySlot.HELMET;
  itemToShow!: InventoryItem;
  modSummary: ModSummary[] = [];

  weaponDrifsShortNames: string[] = ["val", "kalh", "unn"]
  drifSlot: number = 0;
  drifSize: string = "";
  drifName: string = "";

  currentEventTarget: EventTarget | null | undefined;
  isBlockingHideRar: boolean = false;
  showItemDesc: boolean = false;

  showDrifLevel: boolean = false;
  drifToEdit!: InventoryDrif;
  drifToEditFirstClick = false;

  showUpgrade: boolean = false;
  showUpgradeFirstClick = false;

  blockHide = false;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private buildCalculatorService: BuildCalculatorService,
    private incrustationService: RarListIncrustationService,
    protected jwtService: JwtService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private renderer: Renderer2,
    private translateService: TranslateService
  ) {

  }

  ngOnInit(): void {
    let id = Number(this.activatedRoute.snapshot.params['id']);
    this.subscription = this.buildCalculatorService.subject
      .subscribe(newLevel => this.activeSkill.level = newLevel);
    this.renderer.listen('window', 'click', (e: MouseEvent) => {
      if (this.blockHide) {
        this.blockHide = false;
        return;
      }
      this.handleRarDescClick(e);
      this.handleDrifLevelClick(e);
      this.handleUpgradeLevelClick(e);
    });
    this.prepareData()
      .then(() => {
        let tries = 0;
        const interval = setInterval(() => {
          if (this.currentStats.length > 0) {
            this.runCalc();
            clearInterval(interval);
          }
          tries++;
          if (tries > 4) {
            clearInterval(interval);
          }
        }, 500);
      });
  }

  ngAfterViewInit() {
    this.editorConfig.placeholder = this.translate.instant('BUILD_CALCULATOR.TEXT_BOX_PLACEHOLDER');
    this.translate.onLangChange
      .subscribe(e => {
        this.editorConfig.placeholder = this.translate.instant('BUILD_CALCULATOR.TEXT_BOX_PLACEHOLDER');
      })
  }

  ngOnDestroy() {
    //this.saveBuild();
    this.saveSimpleBuild();
    this.subscription.unsubscribe();
  }

  //CALCULATOR

  async prepareData() {
    const obs1$ = this.buildCalculatorService.getAllLegendaryItems()
      .pipe((map(response => this.itemsFromDb = response)));

    const obs2$ = this.buildCalculatorService.getAllOrbs()
      .pipe((map(o => this.orbsFromDb = o)));

    const obs3$ = this.buildCalculatorService.getAllDrifs()
      .pipe((map(d => this.drifsFromDb = d)));

    const obs4$ = this.buildCalculatorService.getInitData()
      .pipe(map(data => {
        this.statsTemplate = data.defaultStatistics;
        this.skillCosts = data.skillCosts;
        this.assignClassSkills(data.classSkills);
        let build: DatabaseBuild = history.state.build;
        if (build) {
          this.loadSavedBuild(build);
          return;
        }
        let id = Number(this.activatedRoute.snapshot.params['id']);
        if (id) {
          this.loadBuildFromDatabase(id);
          return;
        }
        this.loadSimpleBuild();
      }));

    await lastValueFrom(obs1$);
    await lastValueFrom(obs2$);
    await lastValueFrom(obs3$);
    await lastValueFrom(obs4$);
  }

  runCalc() {
    this.showItemsByClickedInventorySlot(this.currentInventorySlot);
    this.loadLocalInventory();
  }

  handleUpgradeLevelClick(e: MouseEvent) {
    if (!this.upgradeDescRef) {
      return;
    }
    let childClick = this.hasSomeParentTheClass(e.target as ParentNode, "drif-show");
    if (!childClick) {
      childClick = this.hasSomeParentTheClass(e.target as ParentNode, "upgrade-menu");
    }
    if (!childClick && !this.showUpgradeFirstClick) {
      this.showUpgrade = false;
      return;
    }
    if (this.showUpgradeFirstClick) {
      this.showUpgradeFirstClick = false;
    }
  }

  handleDrifLevelClick(e: MouseEvent) {
    if (!this.drifLevelRef) {
      return;
    }
    let childClick = this.hasSomeParentTheClass(e.target as ParentNode, "drif-show");
    if (!childClick && !this.drifToEditFirstClick) {
      this.showDrifLevel = false;
      return;
    }
    if (this.drifToEditFirstClick) {
      this.drifToEditFirstClick = false;
    }
  }

  handleRarDescClick(e: MouseEvent) {
    if (!this.isBlockingHideRar) {
      return;
    }

    if (!this.rarRef) {
      this.showItemDesc = true;
      this.doMoveTooltip(e, this.rarRef);
      return;
    }

    let childClick = this.hasSomeParentTheClass(e.target as ParentNode, "rar");
    if (!childClick) {
      childClick = this.hasSomeParentTheClass(e.target as ParentNode, "drif-show");
    }
    if (!childClick) {
      childClick = this.hasSomeParentTheClass(e.target as ParentNode, "upgrade-menu");
    }

    if (!childClick && e.target !== this.rarRef.nativeElement && e.target !== this.currentEventTarget) {
      this.isBlockingHideRar = false;
      this.showItemDesc = false;
      this.currentEventTarget = null;
    }
  }

  setItemToInventory(item: IncrustatedLegendaryItem | undefined) {
    if (!item) {
      this.setItemFromPlayerInventoryByCurrentSlot(undefined);
      return;
    }
    let inventoryItem = this.mapItemToInventoryItem(item);
    this.setItemFromPlayerInventoryByCurrentSlot(inventoryItem);
  }

  mapItemToInventoryItem(item: IncrustatedLegendaryItem) {
    let itemFamily = ItemFamily[item.family as unknown as keyof typeof ItemFamily];
    let mapped: InventoryItem = {
      id: item.id,
      name: item.name,
      family: itemFamily,
      type: item.type,
      incrustationLevel: 1,
      incrustationTarget: IncrustationTarget.EVENLY,
      drifs: this.getCurrentItemDrifs(item, itemFamily),
      orb: this.getCurrentItemOrb(item),
      supportedSlot: this.currentInventorySlot,
      droppingMonsters: [],
      drifBoost: itemFamily === ItemFamily.EPIC ? 0.6 : 0,
      orbBoost: 0,
      upgradeBoost: 0,
      upgradeTarget: UpgradeTarget.HEALTH,
      upgradeLevel: 0,

      weight: item.weight,
      rank: item.rank,
      capacity: item.capacity,
      value: item.value,

      requiredLevel: item.requiredLevel,
      requiredStrength: item.requiredStrength,
      requiredDexterity: item.requiredDexterity,
      requiredPower: item.requiredPower,
      requiredKnowledge: item.requiredKnowledge,
      damage: item.damage,
      damageType: item.damageType,

      strength: item.strength,
      dexterity: item.dexterity,
      power: item.power,
      knowledge: item.knowledge,
      health: item.health,
      mana: item.mana,
      stamina: item.stamina,

      armorSlashing: item.armorSlashing,
      armorCrushing: item.armorCrushing,
      armorPiercing: item.armorPiercing,
      mentalResistance: item.mentalResistance,
      fireResistance: item.fireResistance,
      energyResistance: item.energyResistance,
      coldResistance: item.coldResistance
    }
    return mapped;
  }

  getCurrentItemOrb(item: IncrustatedLegendaryItem) {
    let currentItem = this.getItemFromPlayerInventoryByCurrentSlot();
    if (!currentItem) {
      return undefined;
    }

    if (this.canKeepOrb(item.rank, currentItem.orb)) {
      return currentItem.orb;
    }
    return undefined;
  }

  getCurrentItemDrifs(item: IncrustatedLegendaryItem, family: ItemFamily) { //TODO
    if (family.valueOf() === ItemFamily.EPIC.valueOf()) {
      let drif2 = this.drifsFromDb.find(d => d.shortName === "band");
      if (!drif2) {
        throw new Error("drifs band set to epic error");
      }
      let drifs: InventoryDrif[] = [
        {
          tier: 3,
          level: 1,
          drif: drif2
        }
      ];
      switch (item.name.toUpperCase()) {
        case "GORTHDAR": {
          let drif1 = this.drifsFromDb.find(d => d.shortName === "unn");
          if (!drif1) {
            throw new Error("drifs dedicated set to epic error");
          }
          drifs.push({
            tier: 3,
            level: 1,
            drif: drif1
          })
          return drifs;
        }
        case "ŻMIJ": {
          let drif1 = this.drifsFromDb.find(d => d.shortName === "teld");
          if (!drif1) {
            throw new Error("drifs dedicated set to epic error");
          }
          drifs.push({
            tier: 3,
            level: 1,
            drif: drif1
          })
          return drifs;
        }
        case "ALLENOR": {
          let drif1 = this.drifsFromDb.find(d => d.shortName === "astah");
          if (!drif1) {
            throw new Error("drifs dedicated set to epic error");
          }
          drifs.push({
            tier: 3,
            level: 1,
            drif: drif1
          })
          return drifs;
        }
        case "LATARNIA ŻYCIA": {
          let drif1 = this.drifsFromDb.find(d => d.shortName === "err");
          if (!drif1) {
            throw new Error("drifs dedicated set to epic error");
          }
          drifs.push({
            tier: 3,
            level: 1,
            drif: drif1
          })
          return drifs;
        }
        case "ATTAWA": {
          let drif1 = this.drifsFromDb.find(d => d.shortName === "oda");
          if (!drif1) {
            throw new Error("drifs dedicated set to epic error");
          }
          drifs.push({
            tier: 3,
            level: 1,
            drif: drif1
          })
          return drifs;
        }
        case "IMISINDO": {
          let drif1 = this.drifsFromDb.find(d => d.shortName === "ling");
          if (!drif1) {
            throw new Error("drifs dedicated set to epic error");
          }
          drifs.push({
            tier: 3,
            level: 1,
            drif: drif1
          })
          return drifs;
        }
        case "WASHI": {
          let drif1 = this.drifsFromDb.find(d => d.shortName === "ulk");
          if (!drif1) {
            throw new Error("drifs dedicated set to epic error");
          }
          drifs.push({
            tier: 3,
            level: 1,
            drif: drif1
          })
          return drifs;
        }
      }
    }
    return [];
  }

  canKeepOrb(rarRank: number, orb: Orb | undefined) { //TODO
    return true;
  }

  setItemFromPlayerInventoryByCurrentSlot(newItem: InventoryItem | undefined) {
    let index = -1;
    this.playerInventory.items.forEach((i, ix) => {
      if (i.supportedSlot === this.currentInventorySlot) {
        index = ix;
        if (!newItem) {
          this.playerInventory.items.splice(index, 1);
          return;
        }
        this.playerInventory.items[index] = newItem;
      }
    });

    if (index === -1 && newItem) {
      this.playerInventory.items.push(newItem)
    }
  }

  getItemFromPlayerInventoryByCurrentSlot() {
    return this.playerInventory.items.find((i) => i.supportedSlot === this.currentInventorySlot);
  }

  getItemFromPlayerInventoryByInventorySlot(slot: InventorySlot) {
    return this.playerInventory.items.find((i) => i.supportedSlot === slot);
  }

  changeItemsToShow(slot: InventorySlot, e?: MouseEvent) {
    this.currentInventorySlot = slot;
    this.showItemsByClickedInventorySlot(slot, e);
  }

  showItemsByClickedInventorySlot(slot: InventorySlot, e?: MouseEvent) {
    this.availableToChoose = [];
    this.unavailableToChoose = [];
    switch (slot) {
      case InventorySlot.AMULET: {
        let itemsToShow = this.itemsFromDb.filter(i => i.type.toString() === ItemType[ItemType.AMULET]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.RING_1:
      case InventorySlot.RING_2: {
        let itemsToShow = this.itemsFromDb.filter(i => i.type.toString() === ItemType[ItemType.RING]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.HELMET: {
        let itemsToShow = this.itemsFromDb
          .filter(i => i.type.toString() === ItemType[ItemType.HELMET]);
        this.sortAvailableItems(cloneDeep(itemsToShow));

        break;
      }
      case InventorySlot.GLOVES: {
        let itemsToShow = this.itemsFromDb.filter(i => i.type.toString() === ItemType[ItemType.GLOVES]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.SHIELDORBRACES: {
        let itemsToShow = this.itemsFromDb
          .filter(i => i.type.toString() === ItemType[ItemType.SHIELD] || i.type.toString() === ItemType[ItemType.BRACES]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.ARMOR: {
        let itemsToShow = this.itemsFromDb.filter(i => i.type.toString() === ItemType[ItemType.ARMOR]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.CAPE: {
        let itemsToShow = this.itemsFromDb.filter(i => i.type.toString() === ItemType[ItemType.CAPE]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.BELT: {
        let itemsToShow = this.itemsFromDb.filter(i => i.type.toString() === ItemType[ItemType.BELT]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.PANTS: {
        let itemsToShow = this.itemsFromDb.filter(i => i.type.toString() === ItemType[ItemType.PANTS]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.BOOTS: {
        let itemsToShow = this.itemsFromDb.filter(i => i.type.toString() === ItemType[ItemType.BOOTS]);
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
      case InventorySlot.WEAPON: {
        let itemsToShow = this.itemsFromDb
          .filter(i =>
            i.type.toString() === ItemType[ItemType.SWORD] ||
            i.type.toString() === ItemType[ItemType.AXE] ||
            i.type.toString() === ItemType[ItemType.KNIFE] ||
            i.type.toString() === ItemType[ItemType.HAMMER] ||
            i.type.toString() === ItemType[ItemType.BOW] ||
            i.type.toString() === ItemType[ItemType.STICK] ||
            i.type.toString() === ItemType[ItemType.KNUCKLES] ||
            i.type.toString() === ItemType[ItemType.SWORD_TH] ||
            i.type.toString() === ItemType[ItemType.AXE_TH] ||
            i.type.toString() === ItemType[ItemType.HAMMER_TH]
          );
        this.sortAvailableItems(cloneDeep(itemsToShow));
        break;
      }
    }
    if (e) {
      setTimeout(() => {
        if (this.rarRef) {
          this.doMoveTooltip(e, this.rarRef);
        }
      }, 1);

    }
  }

  sortAvailableItems(items: IncrustatedLegendaryItem[]) {
    let str = this.currentStats.find(s => s.image === "strength")?.level;
    let dex = this.currentStats.find(s => s.image === "dexterity")?.level;
    let pow = this.currentStats.find(s => s.image === "power")?.level;
    let knw = this.currentStats.find(s => s.image === "knowledge")?.level;

    items.forEach(i => {
      if (!str || !dex || !pow || !knw) { // CHECK BEFORE NOT WORK WHO KNOW WHY??
        return;
      }
      let itemFamily = ItemFamily[i.family as unknown as keyof typeof ItemFamily];
      if (itemFamily === ItemFamily.EPIC) {
        if (i.name.toUpperCase() === "GORTHDAR" && this.newClass === "BARBARIAN") {
          if (i.requiredLevel && i.requiredLevel <= this.level) {
            this.availableToChoose.push(i);
            return;
          }
          this.unavailableToChoose.push(i);
          return;
        }
        if (i.name.toUpperCase() === "ŻMIJ" && this.newClass === "FIRE_MAGE") {
          if (i.requiredLevel && i.requiredLevel <= this.level) {
            this.availableToChoose.push(i);
            return;
          }
          this.unavailableToChoose.push(i);
          return;
        }
        if (i.name.toUpperCase() === "ALLENOR" && this.newClass === "KNIGHT") {
          if (i.requiredLevel && i.requiredLevel <= this.level) {
            this.availableToChoose.push(i);
            return;
          }
          this.unavailableToChoose.push(i);
          return;
        }
        if (i.name.toUpperCase() === "LATARNIA ŻYCIA" && this.newClass === "DRUID") {
          if (i.requiredLevel && i.requiredLevel <= this.level) {
            this.availableToChoose.push(i);
            return;
          }
          this.unavailableToChoose.push(i);
          return;
        }
        if (i.name.toUpperCase() === "WASHI" && this.newClass === "SHEED") {
          if (i.requiredLevel && i.requiredLevel <= this.level) {
            this.availableToChoose.push(i);
            return;
          }
          this.unavailableToChoose.push(i);
          return;
        }
        if (i.name.toUpperCase() === "ATTAWA" && this.newClass === "VOODOO") {
          if (i.requiredLevel && i.requiredLevel <= this.level) {
            this.availableToChoose.push(i);
            return;
          }
          this.unavailableToChoose.push(i);
          return;
        }
        if (i.name.toUpperCase() === "IMISINDO" && this.newClass === "ARCHER") {
          if (i.requiredLevel && i.requiredLevel <= this.level) {
            this.availableToChoose.push(i);
            return;
          }
          this.unavailableToChoose.push(i);
          return;
        }
        return;
      }
      if (
        ((i.type.toString() === ItemType[ItemType.SHIELD] && this.newClass === "KNIGHT") || i.type.toString() !== ItemType[ItemType.SHIELD]) &&
        ((i.requiredLevel && i.requiredLevel <= this.level) || !i.requiredLevel) &&
        ((i.requiredStrength && i.requiredStrength <= str) || !i.requiredStrength) &&
        ((i.requiredDexterity && i.requiredDexterity <= dex) || !i.requiredDexterity) &&
        ((i.requiredPower && i.requiredPower <= pow) || !i.requiredPower) &&
        ((i.requiredKnowledge && i.requiredKnowledge <= knw) || !i.requiredKnowledge)
      ) {
        this.availableToChoose.push(i);
        return;
      }
      this.unavailableToChoose.push(i);
    })

    this.availableToChoose.sort(sortItems);
    this.unavailableToChoose.sort(sortItems);
  }

  removeStar(item: InventoryItem) {
    let original = this.getOriginalItem(item);
    if (item.incrustationLevel == 1) {
      return;
    }
    item.incrustationLevel--;

    this.incrustationService.doIncrustation(item as IncrustatedLegendaryItem, IncrustationTarget[item.incrustationTarget].toLowerCase(), undefined, original);
    this.checkItemDrifSpace(item, 0);
    this.setDeducedValues(item);
  }

  addStar(item: InventoryItem) {
    let original = this.getOriginalItem(item);
    if (item.incrustationLevel == 9) {
      return;
    }
    if (!item.incrustationLevel) {
      item.incrustationLevel = 1;
    }
    item.incrustationLevel++;

    this.incrustationService.doIncrustation(item as IncrustatedLegendaryItem, IncrustationTarget[item.incrustationTarget].toLowerCase(), undefined, original);
    this.setDeducedValues(item);
  }

  setDeducedValues(item: InventoryItem) {
    const values = deducedInventoryItemValuesTable[item.incrustationLevel-1];
    item.drifBoost = values.drifBoost;
    item.orbBoost = values.orbBoost;
    item.upgradeBoost = values.upgradeBoost;
    if (item.family.valueOf() === ItemFamily.EPIC.valueOf()) {
      item.drifBoost += 0.6;
    }

  }

  setIncrustationTarget(item: InventoryItem, target: IncrustationTarget, checkStat?: number | undefined) {
    if (!checkStat && target.valueOf() !== IncrustationTarget.EVENLY) {
      this.snackBar.open("Nie możesz inkrustować po statystyce nie będącej startową", "ok!", {duration: 4000})
      return;
    }
    item.incrustationTarget = target;
    let original = this.getOriginalItem(item);
    this.incrustationService.doIncrustation(item as IncrustatedLegendaryItem, IncrustationTarget[item.incrustationTarget].toLowerCase(), undefined, original);
  }

  checkItemDrifSpace(item: InventoryItem, tries: number) {
    if (item.rank <= 3) {
      if (item.incrustationLevel < 7) {
        delete item.drifs[1];
      }
    }
    let usedCapacity = this.getUsedItemCapacity(item);
    let availableCapacity = this.getItemCapacity(item);
    let remainingCapacity = availableCapacity - usedCapacity;
    if (remainingCapacity < 0) {
      if (tries == 0) {
        delete item.drifs[1];
        this.checkItemDrifSpace(item, tries++);
        return;
      }
      if (tries == 1) {
        delete item.drifs[0];
        this.checkItemDrifSpace(item, tries++);
        return;
      }
      if (tries == 2) {
        delete item.drifs[2];
      }
    }
  }

  getOriginalItem(item: InventoryItem) {
    let original = this.itemsFromDb.find(i => i.name === item.name);
    if (!original) {
      throw new Error("unknown item");
    }
    return original;
  }

  blockHideRar(e: MouseEvent, newSlot: InventorySlot) {
    if (this.currentInventorySlot.toString() !== newSlot.toString()) {
      let itemToShow = this.getItemFromPlayerInventoryByInventorySlot(newSlot);
      if (itemToShow) {
        this.itemToShow = itemToShow;
        this.showItemDesc = true;
        this.doMoveTooltip(e, this.rarRef);
      }
    }
    this.currentEventTarget = e.target;
    this.isBlockingHideRar = true;
  }

  blockHideTooltips() {
    this.blockHide = true;
  }

  changeUpgradeLevel(e: MatSliderChange) {
    if (e.value || e.value === 0) {
      this.itemToShow.upgradeLevel = e.value;
    }
  }

  changeDrifLevel(e: MatSliderChange) {
    if (e.value) {
      this.drifToEdit.level = e.value;
    }
  }

  setDrifSlotToChange(number: number) {
    this.drifSlot = number;
  }

  setDrifSize(size: string) {
    this.drifSize = size;
  }

  unsetDrifSize() {
    this.drifSize = "";
    this.drifName = "";
  }

  setDrif(name: string) {
    let item = this.getItemFromPlayerInventoryByCurrentSlot();
    if (!item) {
      return;
    }

    if (item.family === ItemFamily.EPIC) {
      this.snackBar.open("Nie można edytować drifów w epiku", "ok!", {duration: 3000});
      return;
    }
    if (name === "") {
      delete item.drifs[this.drifSlot];
      this.countModSum();
      return;
    }

    this.drifName = name;

    let drif = this.getDrifByName(name);
    item.drifs[this.drifSlot] = {
      tier: this.getDrifTierByName(),
      level: 1,
      drif: cloneDeep(drif)
    };
    this.countModSum();
  }

  getDrifByName(name: string) {
    let drif = this.drifsFromDb.find(d => d.shortName === name);
    if (!drif) {
      throw new Error("unknown drif name");
    }
    return drif;
  }

  cantPutDrifTier(tier: number) {
    let currentItem = this.getItemFromPlayerInventoryByCurrentSlot();
    if (!currentItem) {
      return true;
    }
    if (currentItem.family === ItemFamily.EPIC) {
      return true;
    }
    let usedCapacity = this.getUsedItemCapacity(currentItem);
    let availableCapacity = this.getItemCapacity(currentItem);
    let remainingCapacity = availableCapacity - usedCapacity;

    let editedDrif = currentItem.drifs[this.drifSlot];
    if (editedDrif) {
      remainingCapacity += editedDrif.tier * editedDrif.drif.startPower;
    }

    if (remainingCapacity === 0) {
      return true;
    }

    if (tier === 4 && currentItem.rank < 10) {
      return true;
    }
    if (tier === 3 && currentItem.rank < 7) {
      return true;
    }
    if (tier === 2 && currentItem.rank < 4) {
      return true;
    }

    if (currentItem.rank >= 10 && remainingCapacity >= 4) {
      return false;
    }
    if (currentItem.rank >= 7 && remainingCapacity >= 3) {
      return false;
    }
    if (currentItem.rank >= 4 && remainingCapacity >= 2) {
      return false;
    }
    return false;
  }

  cantPutDrif(drifName: string) {
    let currentItem = this.getItemFromPlayerInventoryByCurrentSlot();
    if (!currentItem) {
      return true;
    }
    if (this.isDuplicatedDrif(drifName, currentItem)) {
      return true;
    }

    if (this.weaponDrifsShortNames.includes(drifName)) {
      if (this.cantPutWeaponDrif(drifName, currentItem)) {
        return true;
      }
    }

    let drifToCheck = this.getDrifByName(drifName);
    let drifTier = this.getDrifTierByName();

    let requiredCapacity = drifToCheck.startPower * drifTier;
    let usedCapacity = this.getUsedItemCapacity(currentItem);
    let availableCapacity = this.getItemCapacity(currentItem);
    let remainingCapacity = availableCapacity - usedCapacity;

    let editedDrif = currentItem.drifs[this.drifSlot];
    if (editedDrif) {
      remainingCapacity += editedDrif.tier * editedDrif.drif.startPower;
    }
    return remainingCapacity < requiredCapacity;
  }

  isDuplicatedDrif(drifShortName: string, currentItem: InventoryItem) {
    let hasDrifWithThisMod = false;
    currentItem.drifs.forEach((d, index) => {
      if (index === this.drifSlot) {
        return;
      }
      if (drifShortName === d.drif.shortName) {
        hasDrifWithThisMod = true;
      }
    });
    return hasDrifWithThisMod;
  }

  cantPutWeaponDrif(drifShortName: string, currentItem: InventoryItem) {
    let supportedSlot = currentItem.supportedSlot as InventorySlot;
    if (supportedSlot != InventorySlot.WEAPON) {
      return true;
    }

    let cantPut = false;
    currentItem.drifs.forEach((d, index) => {
      if (index === this.drifSlot) {
        return;
      }
      if (this.weaponDrifsShortNames.includes(d.drif.shortName)) {
        cantPut = true;
      }
    });
    return cantPut;
  }

  getUsedItemCapacity(currentItem?: InventoryItem, skipIndex?: number) {
    if (!currentItem) {
      currentItem = this.getItemFromPlayerInventoryByCurrentSlot();
      if (!currentItem) {
        return 0;
      }
    }

    let usedCapacity = 0;
    currentItem.drifs.forEach((d, index) => {
      if (skipIndex === index) {
        return;
      }
      usedCapacity += d.drif.startPower * d.tier;
    })

    return usedCapacity;
  }

  getItemCapacity(currentItem?: InventoryItem) {
    if (!currentItem) {
      currentItem = this.getItemFromPlayerInventoryByCurrentSlot();
      if (!currentItem) {
        return 0;
      }
    }
    if (!currentItem) {
      return 0;
    }
    let family= currentItem.family;
    if (family.valueOf() !== ItemFamily.EPIC && family != ItemFamily.RAR && family != ItemFamily.SET) {
      return 0;
    }

    let capacity = currentItem.capacity;
    if (!capacity) {
      return 0;
    }
    if (currentItem.incrustationLevel >= 7) {
      if (currentItem.incrustationLevel === 7) {
        capacity += 1;
      }
      if (currentItem.incrustationLevel === 8) {
        capacity += 2;
      }
      if (currentItem.incrustationLevel === 9) {
        capacity += 4;
      }
    }
    return capacity;
  }

  countModSum() {
    this.modSummary = [];
    this.playerInventory.items.forEach( i => {
      if (i.family === ItemFamily.EPIC) {
        this.modSummary.push({
          mod: PsychoMod.EXTRA_AP,
          drifName: "?",
          modSum: 1,
          amountDrifs: 1,
          category: "SPECIAL"
        });
      }
      i.drifs.forEach(drif => {
        let modSummary = this.modSummary.find(modSum => modSum.mod.valueOf() === drif.drif.psychoMod.valueOf());
        let psychoValue = this.getDrifPsychoValue(i, drif);
        if (modSummary) {
          modSummary.amountDrifs++;
          modSummary.modSum += psychoValue;
          return;
        }
        let modCap = modCaps.find(capped => capped.mod.valueOf() === drif.drif.psychoMod.valueOf());
        this.modSummary.push({
          mod: drif.drif.psychoMod,
          drifName: drif.drif.shortName,
          modSum: psychoValue,
          amountDrifs: 1,
          category: drif.drif.category,
          max: modCap?.value
        })
      })
    })
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

  showUpgradeDesc(e: MouseEvent) {
    if (!this.itemToShow) {
      return;
    }
    this.showUpgrade = true;
    this.showUpgradeFirstClick = true;

    let inter = setInterval(() => {
      if (this.upgradeDescRef) {
        this.doMoveTooltip(e, this.upgradeDescRef, 0, true);
        clearInterval(inter);
      }
    }, 5);
  }

  showDrifLevelDesc(e: MouseEvent, drif: InventoryDrif | undefined) {
    if (!drif) {
      return;
    }
    this.drifToEdit = drif;
    this.showDrifLevel = true;
    this.drifToEditFirstClick = true;

    let inter = setInterval(() => {
      if (this.drifLevelRef) {
        this.doMoveTooltip(e, this.drifLevelRef, 0);
        clearInterval(inter);
      }
    }, 5);
  }

  showDesc(show: boolean, item?: InventoryItem | IncrustatedLegendaryItem, e?: MouseEvent) {

    if (item) {
      if (!item.incrustationLevel) {
        item = this.mapItemToInventoryItem(item as IncrustatedLegendaryItem);
      }
    }

    if (show && item && !this.isBlockingHideRar) {
      this.itemToShow = item as InventoryItem;
    }
    if (this.isBlockingHideRar) {
      return;
    }
    this.showItemDesc = show;

    if (!e) {
      return;
    }
    let inter = setInterval(() => {
      if (this.rarRef) {
        this.moveStats(e);
        clearInterval(inter);
      }
    }, 5);
  }

  moveStats(e: MouseEvent) {
    if (this.isBlockingHideRar) {
      return;
    }
    if (!this.rarRef) {
      return;
    }
    this.doMoveTooltip(e, this.rarRef);
  }

  doMoveTooltip(e: MouseEvent, element: ElementRef, offset?: number, forceLeft?: boolean) {
    if (!offset && offset != 0) {
      offset = 20;
    }


    let requiredHeight = e.clientY + element.nativeElement.offsetHeight + offset;
    let requiredWidth = e.clientX + element.nativeElement.offsetWidth + offset;
    let visibleWindowHeight = window.top?.innerHeight;
    let visibleWindowWidth = window.top?.innerWidth;
    if (!visibleWindowHeight) {
      visibleWindowHeight = 600;
    }
    if (!visibleWindowWidth) {
      visibleWindowWidth = 600;
    }
    let differenceY = requiredHeight - visibleWindowHeight;
    let differenceX = requiredWidth - visibleWindowWidth;

    if (differenceX <= 0 && !forceLeft) {
      element.nativeElement.style.transform = 'translateX(' + (e.clientX + offset) + 'px)';
    } else {
      element.nativeElement.style.transform = 'translateX(' + (e.clientX - element.nativeElement.offsetWidth - offset) + 'px)';
    }
    if (differenceY <= 0) {
      element.nativeElement.style.top = e.clientY + offset + 'px';
    } else {
      element.nativeElement.style.top = e.clientY + offset - differenceY + 'px';
    }
    element.nativeElement.style.visibility = 'visible';
  }

  assignClassSkills(skills: Skill[]) {
    skills.forEach(skill => {
      switch (skill.profession) {
        case "DEFAULT":
          this.basicSkillsTemplate.push(skill);
          break;
        case "BARBARIAN":
          this.bbClassSkills.push(skill);
          break;
        case "FIRE_MAGE":
          this.fmClassSkills.push(skill);
          break;
        case "KNIGHT":
          this.knClassSkills.push(skill);
          break;
        case "DRUID":
          this.drClassSkills.push(skill);
          break;
        case "SHEED":
          this.shClassSkills.push(skill);
          break;
        case "ARCHER":
          this.arClassSkills.push(skill);
          break;
        case "VOODOO":
          this.vdClassSkills.push(skill);
          break;
        default:
          console.log("ERROR");
      }
    })
  }

  calculatePoints() {
    if (this.level > 140) {
      this.level = 140;
      this.newLevel = "140";
    }

    if (this.level <= 1) {
      this.level = 1;
      this.newLevel = "1";
    }

    //CALCULATE STATS POINTS
    this.updateStatPoints();

    //CALCULATE SKILL POINTS
    this.skillPoints = (this.level * ((this.level + 1)) / 2) - 1;

    let spentPoints = 0;
    this.currentClassSkills.forEach(skill => {
      spentPoints += this.skillCosts.find(cost => cost.level == skill.level)!.sumCost;
    })
    this.currentBasicSkills.forEach(skill => {
      if (skill.level != skill.minLevel) {
        if (skill.minLevel != 0) {
          spentPoints += this.skillCosts.find(cost => cost.level == skill.level)!.sumCost - 1;
        } else {
          spentPoints += this.skillCosts.find(cost => cost.level == skill.level)!.sumCost;
        }
      }
    })

    this.remainingSkillPoints = this.skillPoints - spentPoints;

    this.masterPoints = Math.floor(this.remainingSkillPoints / 196);
    this.adeptPoints = Math.floor((this.remainingSkillPoints - (this.masterPoints * 196)) / 14);
    this.studentPoints = Math.floor((this.remainingSkillPoints - (this.masterPoints * 196 + this.adeptPoints * 14)));
  }

  private updateStatPoints() {
    this.statPoints = this.level * 4 + 1;

    let spentStatPoints = 0;
    this.currentStats.forEach(stat => {
      spentStatPoints += stat.level - stat.minLevel;
    })

    this.remainingStatsPoints = this.statPoints - spentStatPoints;
  }

  updateStatById(upgrade: boolean, amount: number, id: number) {
    let targetStat = this.currentStats.find(stat => stat.id == id);
    if (targetStat == null) {
      return;
    }

    if (upgrade) {
      if (this.remainingStatsPoints >= amount) {
        targetStat.level += amount;
      } else {
        let validNumber = targetStat.level + this.remainingStatsPoints;
        if (validNumber >= targetStat.minLevel) {
          if (this.remainingStatsPoints < 0 && targetStat.level != targetStat.minLevel) {
            this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.STATS_ABOVE_REMOVED"), "ok!", {duration: 3000});
          }
          targetStat.level += this.remainingStatsPoints;
        } else {
          targetStat.level = targetStat.minLevel;
        }

      }
    } else {
      let newLevel = targetStat.level - amount;
      if (newLevel >= targetStat.minLevel) {
        targetStat.level = newLevel;
      } else {
        targetStat.level = targetStat.minLevel;
        this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.STAT_MINIMUM"), "ok!", {duration: 3000});
      }
    }
    this.calculatePoints();
    this.showItemsByClickedInventorySlot(this.currentInventorySlot);
  }

  getRealRequiredLevel(isBasicSkill: boolean, targetSkill: Skill) {
    let requiredLevel: number;
    if (isBasicSkill) {
      if (targetSkill.beginLevel == 35) {
        //Pack skill
        requiredLevel = (targetSkill.level * 5) + 35;

      } else {
        requiredLevel = targetSkill.level + 1;
      }
    } else {
      //Class skills
      requiredLevel = targetSkill.level + targetSkill.beginLevel;
    }
    return requiredLevel;
  }

  updateLevelById(upgrade: boolean, id: number) {
    let isBasicSkill: boolean = false;
    let targetSkill = this.currentClassSkills.find(skill => skill.id == id);
    if (targetSkill == null) {
      targetSkill = this.currentBasicSkills.find(skill => skill.id == id);
      isBasicSkill = true;
    }
    if (targetSkill == null) {
      return;
    }
    if (upgrade) {
      if (targetSkill.level == targetSkill.maxLevel) {
        this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.SKILL_MAXIMUM"), "ok!", {duration: 3000});
        return;
      }

      let requiredLevel = this.getRealRequiredLevel(isBasicSkill, targetSkill);

      if (Number.isNaN(requiredLevel)) {
        localStorage.removeItem("build");
        this.snackBar.open("REFRESH PAGE!", "ok!", {duration: 5000});
        this.technicalRefresh = true;
        return;
      }

      if (this.level < requiredLevel) {
        this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.LEVEL_TOO_LOW", {requiredLevel: requiredLevel}), "ok!", {duration: 3000});
        return;
      }

      let upgradeCost: number = this.skillCosts.find(cost => cost.level == targetSkill!.level + 1)!.singleCost;
      if (upgradeCost > this.remainingSkillPoints) {
        this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.NOT_ENOUGH_POINTS"), "ok!", {duration: 3000});
        return;
      }
      targetSkill.level++;

    } else {
      if (targetSkill.level == targetSkill.minLevel) {
        this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.SKILL_MAXIMUM"), "ok!", {duration: 3000});
        return;
      }
      targetSkill.level--;
    }
    this.calculatePoints();
  }

  levelUpdate() {
    let number = parseInt(this.newLevel);
    if (!Number.isNaN(number)) {
      this.level = number;
      this.calculatePoints();
      if (this.resetOnLevelChange) {
        this.classUpdate(this.newClass)
      }
      this.showItemsByClickedInventorySlot(this.currentInventorySlot);
    }
  }

  classUpdate(value: string) {
    switch (value) {
      case "BARBARIAN": {
        this.rewriteCurrentClassSkills(this.bbClassSkills);
        break;
      }
      case "FIRE_MAGE": {
        this.rewriteCurrentClassSkills(this.fmClassSkills);
        break;
      }
      case "DRUID": {
        this.rewriteCurrentClassSkills(this.drClassSkills);
        break;
      }
      case "KNIGHT": {
        this.rewriteCurrentClassSkills(this.knClassSkills);
        break;
      }
      case "ARCHER": {
        this.rewriteCurrentClassSkills(this.arClassSkills);
        break;
      }
      case "SHEED": {
        this.rewriteCurrentClassSkills(this.shClassSkills);
        break;
      }
      case "VOODOO": {
        this.rewriteCurrentClassSkills(this.vdClassSkills);
        break;
      }
    }
    this.playerInventory = {
      items: []
    };
    this.showItemsByClickedInventorySlot(this.currentInventorySlot);
  }

  rewriteCurrentClassSkills(skills: Skill[]) {
    this.currentClassSkills = [];
    this.currentStats = [];
    this.currentBasicSkills = [];
    skills.forEach(val => this.currentClassSkills.push(Object.assign({}, val)));
    this.basicSkillsTemplate.forEach(value => this.currentBasicSkills.push(Object.assign({}, value)));
    this.statsTemplate.forEach(value => this.currentStats.push(Object.assign({}, value)));
    this.calculatePoints();
  }

  setCurrentActive(image: string) {
    this.activeSkillImageName = image;
    this.updateDescription();
  }

  updateDescription() {
    this.activeSkill = structuredClone(this.currentClassSkills.filter(s => s.image === this.activeSkillImageName)[0]);
    if (!this.activeSkill) {
      this.activeSkill = structuredClone(this.currentBasicSkills.filter(s => s.image === this.activeSkillImageName)[0]);
    }
  }

  openSkillLevelSelectDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SkillLevelSelectComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  //SAVING/LOADING

  private saveSimpleBuild(): SimpleBuild | undefined {
    //TODO REFACTOR localInventorySave
    this.saveLocalInventory();

    if (this.build != null &&
      this.build.currentStatistics &&
      this.build.currentBasicSkills &&
      this.build.currentClassSkills &&
      this.build.currentStatistics.length != 0 &&
      this.build.currentBasicSkills.length != 0 &&
      this.build.currentClassSkills.length != 0 &&
      this.build.currentClass) {
      return undefined;
    }
    let stats = this.currentStats.map(stat => {
      let x: BuildSkillStatData = {
        id: this.databaseBuild?.buildDetails.skillStatData.find(ssd => ssd.skillStatId == stat.id && ssd.skillStatType.toString() == SkillStatType[SkillStatType.STAT])?.id,
        skillStatId: stat.id,
        buildDetailsId: this.databaseBuild?.buildDetails.id ? this.databaseBuild.buildDetails.id : undefined,
        level: stat.level,
        skillStatType: SkillStatType.STAT
      }
      return x;
    });
    let basicsSkills = this.currentBasicSkills.map(basic => {
      let x: BuildSkillStatData = {
        id: this.databaseBuild?.buildDetails.skillStatData.find(ssd => ssd.skillStatId == basic.id && ssd.skillStatType.toString() == SkillStatType[SkillStatType.BASIC_SKILL])?.id,
        skillStatId: basic.id,
        buildDetailsId: this.databaseBuild?.buildDetails.id ? this.databaseBuild.buildDetails.id : undefined,
        level: basic.level,
        skillStatType: SkillStatType.BASIC_SKILL
      }
      return x;
    });
    let classSkills = this.currentClassSkills.map(clas => {
      let x: BuildSkillStatData = {
        id: this.databaseBuild?.buildDetails.skillStatData.find(ssd => ssd.skillStatId == clas.id && ssd.skillStatType.toString() == SkillStatType[SkillStatType.CLASS_SKILL])?.id,
        skillStatId: clas.id,
        buildDetailsId: this.databaseBuild?.buildDetails.id ? this.databaseBuild.buildDetails.id : undefined,
        level: clas.level,
        skillStatType: SkillStatType.CLASS_SKILL
      }
      return x;
    });

    let buildSkillStatData = stats.concat(basicsSkills, classSkills);
    let build: SimpleBuild = {
      id: this.databaseBuild?.buildDetails.id ? this.databaseBuild.buildDetails.id : 0,
      buildId: this.databaseBuild?.id ? this.databaseBuild.id : 0,
      profession: this.newClass,
      level: this.level,
      skillStatData: buildSkillStatData,
    }
    localStorage.setItem("simple-build", JSON.stringify(build, function replacer(key, value) {
      return value;
    }));
    return build;
  }

  saveLocalInventory() {
    let localInventory: LocalInventory = {
      items: this.getInventoryLocalItems()
    }
    localStorage.setItem("beta-inventory", JSON.stringify(localInventory, function replacer(key, value) {
      return value;
    }));
  }

  getInventoryLocalItems() {
    let localItems: LocalItem[] = [];
    this.playerInventory.items.forEach(i => {
      if (!i.id) {
        return;
      }
      localItems.push({
        id: i.id,
        supportedSlot: i.supportedSlot,
        incrustationLevel: i.incrustationLevel,
        incrustationTarget: i.incrustationTarget,
        upgradeTarget: i.upgradeTarget,
        upgradeLevel: i.upgradeLevel,
        drifs: this.getLocalDrifs(i.drifs)
      })
    });
    return localItems;
  }

  getLocalDrifs(drifs: InventoryDrif[]) {
    let localDrifs: LocalDrif[] = [];
    drifs.forEach(d => {
      localDrifs.push({
        drifId: d.drif.id,
        level: d.level,
        tier: d.tier
      });
    });
    return localDrifs;
  }

  private loadBuildFromDatabase(id: number) {
    if (!this.jwtService.isLoggedIn()) {
      this.buildCalculatorService.getBuildWithoutAccount(id)
        .subscribe({
          next: build => this.loadSavedBuild(build),
          error: () => this.buildNotFound = true
        });
      return;
    }
    this.buildCalculatorService.getBuild(id)
      .subscribe({
        next: build => this.loadSavedBuild(build),
        error: () => this.buildNotFound = true
      });
  }

  private loadSavedBuild(build: DatabaseBuild) {
    this.classUpdate(build.buildDetails.profession);
    this.level = build.buildDetails.level;
    this.newLevel = build.buildDetails.level.toString();
    this.newClass = build.buildDetails.profession;
    this.readSkillStatData(build.buildDetails.skillStatData);
    this.databaseBuild = build;
    this.description = build.description;
    this.buildName = build.buildName;
    this.shortDescription = build.shortDescription;
    this.privateBuild = build.hidden;
    this.pvpBuild = build.pvpBuild;
    this.calculatePoints();
  }

  private loadSimpleBuild() {
    let data = localStorage.getItem('simple-build');
    if (data == null) {
      this.rewriteCurrentClassSkills(this.bbClassSkills);
      return;
    }
    let build: SimpleBuild = JSON.parse(data)

    if (!build) {
      this.rewriteCurrentClassSkills(this.bbClassSkills);
      return;
    }

    this.classUpdate(build.profession);
    this.level = build.level;
    this.newLevel = build.level.toString();
    this.newClass = build.profession;
    this.readSkillStatData(build.skillStatData);
    this.calculatePoints();
  }

  private readSkillStatData(skillStatData: BuildSkillStatData[]) {
    skillStatData.forEach(data => {
      if (data.skillStatType == SkillStatType.STAT || data.skillStatType.toString() == SkillStatType[SkillStatType.STAT]) {
        let stat = this.currentStats.find(s => s.id == data.skillStatId);
        if (stat) {
          stat.level = data.level;
        }
        return;
      }
      if (data.skillStatType == SkillStatType.BASIC_SKILL || data.skillStatType.toString() == SkillStatType[SkillStatType.BASIC_SKILL]) {
        let stat = this.currentBasicSkills.find(s => s.id == data.skillStatId);
        if (stat) {
          stat.level = data.level;
        }
        return;
      }
      if (data.skillStatType == SkillStatType.CLASS_SKILL || data.skillStatType == SkillStatType[SkillStatType.CLASS_SKILL]) {
        let stat = this.currentClassSkills.find(s => s.id == data.skillStatId);
        if (stat) {
          stat.level = data.level;
        }
        return;
      }
    });
  }

  loadLocalInventory() {
    let data = localStorage.getItem('beta-inventory');
    if (data == null) {
      return;
    }
    let localInventory: LocalInventory = JSON.parse(data);

    localInventory.items.forEach(localItem => {
      let item = this.itemsFromDb.find(i => i.id === localItem.id);
      if (!item) {
        return;
      }
      let convertedItem = this.mapItemToInventoryItem(item);
      this.fillItemWithLocalData(localItem, convertedItem);
      this.incrustationService.doIncrustation(convertedItem as IncrustatedLegendaryItem, IncrustationTarget[convertedItem.incrustationTarget].toLowerCase(), undefined, item);
      this.setDeducedValues(convertedItem);
      this.playerInventory.items.push(convertedItem);
    })
  }

  fillItemWithLocalData(localItem: LocalItem, convertedItem: InventoryItem) {
    convertedItem.supportedSlot = localItem.supportedSlot;
    convertedItem.incrustationLevel = localItem.incrustationLevel;
    convertedItem.incrustationTarget = localItem.incrustationTarget;
    convertedItem.upgradeLevel = localItem.upgradeLevel;
    convertedItem.upgradeTarget = localItem.upgradeTarget;
    convertedItem.drifs = this.convertLocalDrifsToInventoryDrifs(localItem.drifs)
  }

  convertLocalDrifsToInventoryDrifs(localDrifs: LocalDrif[]) {
    let inventoryDrifs: InventoryDrif[] = [];
    localDrifs.forEach(d => {
      let originalDrif = this.drifsFromDb.find(dbDrif => dbDrif.id === d.drifId);
      if (!originalDrif) {
        return;
      }
      inventoryDrifs.push({
        tier: d.tier,
        level: d.level,
        drif: originalDrif
      });
    });
    return inventoryDrifs;
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    //this.saveBuild();
    this.saveSimpleBuild();
  }

  saveOnServer() {
    let uuid = this.jwtService.getUuid();
    if (!uuid) {
      this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.NOT_LOGGED_IN"), "ok", {duration: 3000});
      return;
    }

    let simpleBuild = this.saveSimpleBuild();
    if (!simpleBuild) {
      this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.BUILD_SAVE_ERROR"), "ok", {duration: 3000});
      return;
    }

    this.saveButton.disabled = true;
    let databaseBuild: DatabaseBuild = {
      id: 0,
      profile: {uuid: uuid} as ProfileDto,
      buildName: this.buildName ? this.buildName : "No name",
      pvpBuild: this.pvpBuild,
      hidden: this.privateBuild,
      liking: [],
      shortDescription: this.shortDescription,
      description: this.description,
      buildDetails: simpleBuild
    };

    this.buildCalculatorService.saveBuild(databaseBuild)
      .subscribe({
        next: build => this.router.navigate(["/build-calculator/build/" + build.id], {state: {build: build}}),
        error: () => {
          this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.BUILD_MANIPULATED"), "ok", {duration: 3000});
          this.saveButton.disabled = false;
        }
      });
  }

  //VOTING

  updateOnServer() {
    let uuid = this.jwtService.getUuid();
    if (!uuid) {
      this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.NOT_LOGGED_IN"), "ok", {duration: 3000});
      return;
    }

    let simpleBuild = this.saveSimpleBuild();
    if (!simpleBuild) {
      return;
    }
    this.saveButton.disabled = true;

    this.databaseBuild.buildDetails = simpleBuild;
    this.databaseBuild.buildName = this.buildName ? this.buildName : "No name";
    this.databaseBuild.shortDescription = this.shortDescription;
    this.databaseBuild.description = this.description;
    this.databaseBuild.pvpBuild = this.pvpBuild;
    this.databaseBuild.hidden = this.privateBuild;

    this.buildCalculatorService.updateBuild(this.databaseBuild)
      .subscribe({
        next: build => {
          this.databaseBuild = build;
          this.saveButton.disabled = false;
          this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.BUILD_SAVE_SUCCESS"), "ok", {duration: 3000});
        },
        error: () => {
          this.saveButton.disabled = false;
          this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.BUILD_SAVE_ERROR"), "ok", {duration: 3000});
        }
      })
  }

  upvote() {
    let uuid = this.jwtService.getUuid();
    if (!uuid) {
      this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.NOT_LOGGED_IN"), "ok", {duration: 3000});
      return;
    }
    if (this.databaseBuild.profile.uuid === uuid) {
      this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.OWN_BUILD_LIKE"), "ok", {duration: 3000});
      return;
    }
    let liker: BuildLiker = {
      buildId: this.databaseBuild.id,
      likerUuid: uuid
    }
    this.buildCalculatorService.addLiker(liker)
      .subscribe({
        next: like => this.databaseBuild.liking.push(like),
        error: () => this.snackBar.open(this.translate.instant("BUILD_CALCULATOR.ALERTS.BUILD_LIKED_EARLIER"), "ok", {duration: 3000})
      });
  }

  //HTML PRINTING

  currentSelectedSlot(slot: InventorySlot) {
    return this.currentInventorySlot === slot;
  }

  getValueString(n: number | undefined, upgradeTarget: UpgradeTarget) {
    if (!n) {
      n = 0;
    }
    if (this.itemToShow.upgradeTarget.valueOf() === upgradeTarget.valueOf()) {
      n += this.getUpgradeStats();
    }
    if (this.itemToShow.family.valueOf() === ItemFamily.EPIC.valueOf() && upgradeTarget.valueOf() === UpgradeTarget.DAMAGE) {
      n += this.level;
    }
    if (n > 0) {
      return "+" + n;
    }
    return n;
  }

  getUpgradeStats(item?: InventoryItem, target?: UpgradeTarget) {
    if (!item) {
      item = this.itemToShow;
    }
    if(!item) {
      return 0;
    }

    if (target && target.valueOf() !== item.upgradeTarget.valueOf()) {
      return 0;
    }

    let byTenBooster = 1;
    if (
        item.upgradeTarget.valueOf() === UpgradeTarget.HEALTH ||
        item.upgradeTarget.valueOf() === UpgradeTarget.MANA ||
        item.upgradeTarget.valueOf() === UpgradeTarget.STAMINA
    ) {
      byTenBooster = 10;
    }

    let upgradeBoost = item.upgradeBoost;
    if (item.upgradeTarget.valueOf() === UpgradeTarget.DAMAGE) {
      return Math.ceil((item.upgradeLevel * 3) * (upgradeBoost + 1));
    }

    if (item.rank >= 10) {
      return Math.ceil(this.upgradeArcyTier(item) * (upgradeBoost + 1) * byTenBooster);
    }
    if (item.rank >= 7) {
      return Math.ceil(this.upgradeMagniTier(item) * (upgradeBoost + 1) * byTenBooster);
    }
    if (item.rank >= 4) {
      return Math.ceil(this.upgradeBiTier(item) * (upgradeBoost + 1) * byTenBooster);
    }
    return Math.ceil(this.upgradeSubTier(item) * (upgradeBoost + 1) * byTenBooster);
  }

  upgradeSubTier(item: InventoryItem) {
    let upgradeSum = 0;
    for (let i = 0; i < item.upgradeLevel; i++) {
      if (i >= 9) {
        upgradeSum++;
      }
      upgradeSum++;
    }
    return upgradeSum;
  }

  upgradeBiTier(item: InventoryItem) {
    let upgradeSum = 0;
    for (let i = 0; i < item.upgradeLevel; i++) {
      if (i >= 8 - 1) {
        upgradeSum++;
      }
      upgradeSum++;
    }
    return upgradeSum;
  }

  upgradeMagniTier(item: InventoryItem) {
    let upgradeSum = 0;
    for (let i = 0; i < item.upgradeLevel; i++) {
      if (i >= 10 - 1) {
        upgradeSum++;
      }
      if (i >= 7 - 1) {
        upgradeSum++;
      }
      upgradeSum++;
    }
    return upgradeSum;
  }
  upgradeArcyTier(item: InventoryItem) {
    let upgradeSum = 0;
    for (let i = 0; i < item.upgradeLevel; i++) {
      if (i >= 10 - 1) {
        upgradeSum++;
      }
      if (i >= 8 - 1) {
        upgradeSum++;
      }
      if (i >= 6 - 1) {
        upgradeSum++;
      }
      upgradeSum++;
    }
    return upgradeSum;
  }

  getLevelStyle(level: number): String {
    if (level <= 7) {
      return "student";
    }
    if (level > 7 && level <= 14) {
      return "adept";
    }
    return "master";
  }

  getPrettyLevel(level: number) {
    if (level <= 7) {
      return level;
    }
    if (level > 7 && level <= 14) {
      return level - 7;
    }
    return level - 14;
  }

  isBasicSkill(skillId: number) {
    let targetSkill = this.currentClassSkills.find(skill => skill.id == skillId);
    return targetSkill == null;
  }

  getLevelString(level: number) {
    return this.buildCalculatorService.getLevelString(level);
  }

  getPrettyProfession(value: string): string {
    switch (value) {
      case "BARBARIAN": {
        return "Barbarzyńca";
      }
      case "FIRE_MAGE": {
        return "Mag ognia";
      }
      case "DRUID": {
        return "Druid";
      }
      case "KNIGHT": {
        return "Rycerz";
      }
      case "ARCHER": {
        return "Łucznik";
      }
      case "SHEED": {
        return "Sheed";
      }
      case "VOODOO": {
        return "Voodoo";
      }
      default:
        return "Unknown";
    }
  }

  getActiveSkillBasic(level: number): SkillBasic {
    if (level - 1 < 0) {
      level = 1;
    }
    let basic = this.activeSkill.skillBasics.find(basic => basic.skillLevel === level);
    if (basic) {
      return basic;
    }

    return {
      id: 0,
      classSkillId: 0,
      skillLevel: 0,
      damage: 0,
      hitChance: 0,
      manaCost: 0,
      staminaCost: 0,
      roundsTime: 0,
      effectRoundsTime: 0,
      additionalEffectChance: 0,
      specialEffectDescription: "-",
      specialEffectValue: 0,
      skillDifficulty: "EASY",
      skillPsychoEffects: [],
      skillCustomEffects: []
    };
  }

  getRequiredWisdomForSkill(skillLevel: number, pa: number, difficulty: string) {
    switch (difficulty) {
      case "VERY_EASY": {
        let req = Math.round((70 + (skillLevel - 1) * 10) / pa - 40 - this.level);
        return req >= 10 ? req : 10;
      }
      case "EASY": {
        let req = Math.round((105 + (skillLevel - 1) * 15) / pa - 40 - this.level);
        return req >= 10 ? req : 10;
      }
      case "NORMAL": {
        let req = Math.round((140 + (skillLevel - 1) * 20) / pa - 40 - this.level);
        return req >= 10 ? req : 10;
      }
      case "HARD": {
        let req = Math.round((210 + (skillLevel - 1) * 30) / pa - 40 - this.level);
        return req >= 10 ? req : 10;
      }
      default: {
        console.log("NOT FOUND DIFFICULTY");
        return 99;
      }
    }
  }

  printSpecialEffect(basic: SkillBasic) {
    let translateEffect = basic.specialEffectDescription.toUpperCase().replaceAll(" ", "_");
    if (basic.specialEffectDescription === "Siła odczarowania") {
      return this.translate.instant('CUSTOM_EFFECTS.' + translateEffect) + ": " + basic.specialEffectValue;
    }
    return this.translate.instant('CUSTOM_EFFECTS.' + translateEffect) + ": " + basic.specialEffectValue + "%";
  }

  printCustomEffectValue(custom: SkillCustomEffect) {
    return this.checkPrintColon(custom.description) + " " + this.printCustomValue(custom);
  }

  checkPrintColon(mod: string) {
    if (!mod.includes(":")) {
      return ":";
    }
    return "";
  }

  printPsychoValue(effect: SkillPsychoEffect) {
    if (notPercentEffects.filter(n => effect.psychoEffect === n).length > 0) {
      return effect.value;
    }
    return effect.value + "%";
  }

  printCustomValue(effect: SkillCustomEffect) {
    if (notPercentEffects.filter(n => effect.description === n).length > 0) {
      return effect.value;
    }
    return effect.value + "%";
  }

  getDrifCategoryTierString(drif: InventoryDrif) {
    let cat = drif.drif.category.toString().toLowerCase();
    let size = this.getDrifTierByLevel(drif.tier).toLowerCase();
    return cat + "_" + size;
  }

  getDrifTierByName() {
    switch (this.drifSize) {
      case "sub": {
        return 1;
      }
      case "bi": {
        return 2;
      }
      case "magni": {
        return 3;
      }
      case "arcy": {
        return 4;
      }
      default: {
        return 1;
      }
    }
  }

  getDrifTierByLevel(level: number) {
    switch (level) {
      case 1: {
        return "Sub";
      }
      case 2: {
        return "Bi";
      }
      case 3: {
        return "Magni";
      }
      case 4: {
        return "Arcy";
      }
      default: {
        return "Sub";
      }
    }
  }

  getDrifPsychoValue(item: InventoryItem, drif: InventoryDrif) {
    let value = drif.level * drif.drif.psychoGrowByLevel;
    value += drif.drif.psychoGrowByLevel * (drif.tier - 1);
    if (drif.tier === 4 && drif.level >= 19) {
      value += (drif.level - 18) * drif.drif.psychoGrowByLevel;
    }

    value += value * item.drifBoost;
    return floor(value, 2);
  }

  getDrifDesc(item: InventoryItem, drif: InventoryDrif) {
    return `${this.getDrifTierByLevel(drif.tier)}drif ${drif.drif.shortName}

    ${this.translateService.instant('PSYCHO_EFFECTS.' + drif.drif.psychoMod)} ${this.getDrifPsychoValue(item, drif)}%

    Poziom: ${drif.level}
    Potęga: ${drif.drif.startPower * drif.tier}
    `
  }

  getDrifShortDesc(shortName: string) {
    if (!this.drifsFromDb) {
      return "";
    }
    let drif = this.drifsFromDb.find(d => d.shortName === shortName);
    if (!drif) {
      return "";
    }
    let neededPower = drif.startPower * this.getDrifTierByName();
    let usedCapacity = this.getUsedItemCapacity(undefined, this.drifSlot);
    let capacity = this.getItemCapacity();

    return this.translateService.instant('PSYCHO_EFFECTS.' + drif.psychoMod) + " " + usedCapacity + "(+" + neededPower + ")" + "/" + capacity;
  }

  getFamily(item: InventoryItem | IncrustatedLegendaryItem | undefined) {
    if (!item) {
      return "";
    }
    let family = item.family.toString().toLowerCase();
    if (!isNaN(Number(family))) {
      family = ItemFamily[item.family].toLowerCase();
    }
    return family;
  }

  //UTILS

  hasSomeParentTheClass(parent: ParentNode, classname: string): boolean {
    let parentNode = parent.parentNode;
    if (!parentNode) {
      return false;
    }
    let element = parent as Element;
    if (element.className.split(' ').indexOf(classname) >= 0) {
      return true;
    }
    return (parentNode && this.hasSomeParentTheClass(parentNode, classname));
  }

  getStatSum(res: string) {
    let statSum = 0;
    switch (res) {
      case "health": {
        this.playerInventory.items.forEach(i => {
          let stat = i.health;
          if (!stat) {
            stat = 0;
          }
          statSum += stat;
          if (i.upgradeTarget.valueOf() === UpgradeTarget.HEALTH) {
            statSum += this.getUpgradeStats(i);
          }
        });
        break;
      }
      case "mana": {
        this.playerInventory.items.forEach(i => {
            let stat = i.mana;
            if (!stat) {
                stat = 0;
            }
            statSum += stat;
            if (i.upgradeTarget.valueOf() === UpgradeTarget.MANA) {
                statSum += this.getUpgradeStats(i);
            }
        });
        break;
      }
      case "stamina": {
        this.playerInventory.items.forEach(i => {
            let stat = i.stamina;
            if (!stat) {
                stat = 0;
            }
            statSum += stat;
            if (i.upgradeTarget.valueOf() === UpgradeTarget.STAMINA) {
                statSum += this.getUpgradeStats(i);
            }
        });
        break;
      }
      case "strength": {
        this.playerInventory.items.forEach(i => {
            let stat = i.strength;
            if (!stat) {
                stat = 0;
            }
            statSum += stat;
            if (i.upgradeTarget.valueOf() === UpgradeTarget.STRENGTH) {
                statSum += this.getUpgradeStats(i);
            }
        });
        break;
      }
      case "dexterity": {
        this.playerInventory.items.forEach(i => {
            let stat = i.dexterity;
            if (!stat) {
                stat = 0;
            }
            statSum += stat;
            if (i.upgradeTarget.valueOf() === UpgradeTarget.DEXTERITY) {
                statSum += this.getUpgradeStats(i);
            }
        });
        break;
      }
      case "power": {
        this.playerInventory.items.forEach(i => {
            let stat = i.power;
            if (!stat) {
                stat = 0;
            }
            statSum += stat;
            if (i.upgradeTarget.valueOf() === UpgradeTarget.POWER) {
                statSum += this.getUpgradeStats(i);
            }
        });
        break;
      }
      case "knowledge": {
        this.playerInventory.items.forEach(i => {
            let stat = i.knowledge;
            if (!stat) {
                stat = 0;
            }
            statSum += stat;
            if (i.upgradeTarget.valueOf() === UpgradeTarget.KNOWLEDGE) {
                statSum += this.getUpgradeStats(i);
            }
        });
        break;
      }
      default:
        break;
    }
    return statSum;
  }

  getResSum(res: string) {
    let resSum = 0;
    switch (res) {
      case "slash": {
        this.playerInventory.items.forEach(i => {
          if (i.armorSlashing) {
            resSum += i.armorSlashing;
          }
        });
        break;
      }
      case "crush": {
        this.playerInventory.items.forEach(i => {
          if (i.armorCrushing) {
            resSum += i.armorCrushing;
          }
        });
        break;
      }
      case "pierc": {
        this.playerInventory.items.forEach(i => {
          if (i.armorPiercing) {
            resSum += i.armorPiercing;
          }
        });
        break;
      }
      case "fire": {
        this.playerInventory.items.forEach(i => {
          if (i.fireResistance) {
            resSum += i.fireResistance;
          }
        });
        break;
      }
      case "cold": {
        this.playerInventory.items.forEach(i => {
          if (i.coldResistance) {
            resSum += i.coldResistance;
          }
        });
        break;
      }
      case "energy": {
        this.playerInventory.items.forEach(i => {
          if (i.energyResistance) {
            resSum += i.energyResistance;
          }
        });
        break;
      }
      case "mental": {
        this.playerInventory.items.forEach(i => {
          if (i.mentalResistance) {
            resSum += i.mentalResistance;
          }
        });
        break;
      }
      default:
        break;
    }
    return resSum;
  }

  getResSumPercent(res: string) {
    return resistances[this.getResSum(res)];
  }

  showDrifSummary() {
    this.countModSum();
    if (this.modSummary.length === 0) {
      this.snackBar.open("Brak modów do policzenia", "ok!", {duration: 3000});
      return;
    }
    let matDialogRef = this.dialog.open(DrifSumDialogComponent, {
      width: '500px',
      minWidth: '300px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      panelClass: 'mod-sum-dialog',
      data: {
        summary: this.modSummary,
      }
    });
    matDialogRef.afterClosed();
  }

  protected readonly Array = Array;
  protected readonly IncrustationTarget = IncrustationTarget;
  protected readonly UpgradeTarget = UpgradeTarget;
  protected readonly ItemFamily = ItemFamily;
}

const sortItems = (a: IncrustatedLegendaryItem, b: IncrustatedLegendaryItem) => {
  if ((!a.requiredLevel || !b.requiredLevel) || (!a.requiredLevel && !b.requiredLevel)) {
    return 0;
  }
  if (a.requiredLevel > b.requiredLevel) {
    return 1;
  }
  if (a.requiredLevel < b.requiredLevel) {
    return -1;
  }
  return 0;
}

const notPercentEffects = [
  "Odporności fizyczne",
  "Odporność na obrażenia od magii",
  "Redukuje poziom efektu o",
  "Maksymalna ilość petów",
  "Suma rang",
  "Odporność na ogień",
  "Odporność na zimno",
  "Odporność na uroki",
  "Odporność na obuchowe",
  "Odporność na kłute",
  "Odporność na sieczne",
  "Odporność na ogień: poziom postaci * ",
  "Odporność na urok: poziom postaci * ",
  "Liczba odbić",
  "Odporności fizyczne",
  "Zużycie many co rundę",
  "Ilość uników",
  "Ilość bloków",
  "Redukcja bazowej wiedzy do",
  "Redukcja bazowych PŻ do",
  "Siła odczarowania",
  "Redukcja obrażeń many",

  "EXTRA_AP",
]

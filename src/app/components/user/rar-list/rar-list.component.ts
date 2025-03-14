import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LegendaryItemsService} from "@services/user/items/legendary-items.service";
import {ItemComparatorComponent} from "./item-comparator/item-comparator.component";
import {IncrustatedLegendaryItem} from "@models/items/incrustatedLegendaryItem";
import {cloneDeep} from 'lodash-es';
import {RarIncrustationService} from "@services/user/incrustation/rar-incrustation.service";
import {TranslateService} from "@ngx-translate/core";
import {DamageType} from "@models/items/damageType";
import {ItemType} from "@models/items/itemType";
import {MonsterWithIncrustatedLegendaryItems} from "@models/gameentites/monster";
import {ItemFamily} from "@models/items/itemFamily";
import {ItemSet} from "@models/set/itemSet";
import {Profession} from "@models/gameentites/profession";
import {PsychoMod} from "@models/items/psychoMod";
import {IncrustationTarget} from "@models/items/incrustationTarget";
import {MatSelect} from "@angular/material/select";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatOption} from "@angular/material/core";

@Component({
    selector: 'app-rar-list',
    templateUrl: './rar-list.component.html',
    styleUrls: ['./rar-list.component.scss'],
    standalone: false
})
export class RarListComponent implements OnInit, OnDestroy {

  protected readonly DamageType = DamageType;
  protected readonly ItemType = ItemType;
  protected readonly Array = Array;
  @ViewChild('types') typeSelector!: MatSelect;
  monsters!: MonsterWithIncrustatedLegendaryItems[];
  fallBackMonsters!: MonsterWithIncrustatedLegendaryItems[];
  sets!: ItemSet[];
  fallBackSets!: ItemSet[];
  epics!: IncrustatedLegendaryItem[];
  fallBackEpics!: IncrustatedLegendaryItem[];
  legendaryEpics!: IncrustatedLegendaryItem[];
  fallBackLegendaryEpics!: IncrustatedLegendaryItem[];
  toCompare: IncrustatedLegendaryItem[] = [];
  searchValue!: string;
  searchItemType: ItemType[] = [];
  armorTypes: ItemType[] = [ItemType.HELMET, ItemType.CAPE, ItemType.ARMOR, ItemType.BELT, ItemType.PANTS, ItemType.BOOTS, ItemType.GLOVES, ItemType.BRACES];
  jeweleryTypes: ItemType[] = [ItemType.RING, ItemType.AMULET];
  weaponTypes: ItemType[] = [ItemType.SHIELD, ItemType.SWORD, ItemType.AXE, ItemType.KNIFE, ItemType.HAMMER, ItemType.BOW, ItemType.SWORD_TH, ItemType.AXE_TH, ItemType.HAMMER_TH, ItemType.KNUCKLES, ItemType.STICK];
  searchItemRank!: number[];
  searchMagicItems: boolean = true;
  searchPhysicalItems: boolean = true;
  modernView: boolean = false;
  currentItemsType: string = "rars";
  ranks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  searchMinLvl: number = 0;
  searchMaxLvl: number = 0;
  rotated: boolean = false;
  targetIncrustationStat: IncrustationTarget = IncrustationTarget.EVENLY;

  page: number = 1;

  constructor(
    private dialog: MatDialog,
    private rarListService: LegendaryItemsService,
    private snackBar: MatSnackBar,
    private incrustationService: RarIncrustationService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.loadData();
    this.initData();

    const scroller = document.querySelector("#pageContent");
    const scroller2 = document.querySelector(".test-gal");

    scroller?.addEventListener("scroll", (event) => {
      if ((scroller.scrollHeight - scroller.scrollTop) < 1500) {
        if (this.monsters.length > this.page * 5) {
          this.page++;
        }
      }
    });
    scroller2?.addEventListener("touchmove", (event) => {
      if ((scroller2.scrollHeight - window.scrollY) < 1100) {
        if (this.monsters.length > this.page * 5) {
          this.page++;
        }
      }
    });

    this.translate.onLangChange
      .subscribe(e => {
        console.log("CHANGE");
        this.translateItemsAndMonsters(e.lang);
      });
  }

  ngOnDestroy() {
    this.saveData();
  }

  translateItemsAndMonsters(lang: string) {
    if (!this.fallBackMonsters) {
      return;
    }
    this.monsters = cloneDeep(this.fallBackMonsters);

    this.monsters.forEach(m => {
      m.translatedName = this.translate.instant('ITEMS.BOSSES.' + m.name.toUpperCase().replaceAll(" ", "_"));
      m.legendaryDrops.forEach(i => {
        i.translatedName = this.translate.instant('ITEMS.RARS.' + i.name.toUpperCase().replaceAll(" ", "_"));
      });
    })
    if (this.epics) {
      this.epics.forEach(e => {
        e.translatedName = this.translate.instant('ITEMS.EPICS.' + e.name.toUpperCase().replaceAll(" ", "_"));
      });
    }
    if (this.legendaryEpics) {
      this.legendaryEpics.forEach(e => {
        e.translatedName = this.translate.instant('ITEMS.EPICS.' + e.name.toUpperCase().replaceAll(" ", "_"));
      });
    }

    if (this.sets) {
      this.sets.forEach(s => {
        s.setLegendaryItems.forEach(i => {
          i.translatedName = this.translate.instant('ITEMS.SETS.' + i.name.toUpperCase().replaceAll(" ", "_"));
        })
      })
    }

    this.initSort();
  }

  initData() {
    this.rarListService.getAllMonstersWithLegendaryItems()
      .subscribe(m => {
        this.fallBackMonsters = cloneDeep(m);
        this.monsters = cloneDeep(m);
        this.translateItemsAndMonsters(this.translate.currentLang);
      });

    this.rarListService.getAllByFamily(ItemFamily.EPIC)
      .subscribe(e => {
        this.fallBackEpics = cloneDeep(e);
        this.epics = e;
        this.translateItemsAndMonsters(this.translate.currentLang);
      });

    this.rarListService.getAllByFamily(ItemFamily.LEGENDARY_EPIC)
      .subscribe(e => {
        this.fallBackLegendaryEpics = cloneDeep(e);
        this.legendaryEpics = e;
        this.translateItemsAndMonsters(this.translate.currentLang);
      });

    this.rarListService.getAllSets()
      .subscribe(s => {
        this.sortSets(s);
        this.fallBackSets = cloneDeep(s);
        this.sets = s;
        this.translateItemsAndMonsters(this.translate.currentLang);
      });
  }

  sortSets(sets: ItemSet[]) {
    sets.sort((a, b) => {
      let levelA = a.setLegendaryItems[0]?.requiredLevel || 10;
      let levelB = b.setLegendaryItems[0]?.requiredLevel || 10;
      return levelA - levelB;
    });
  }

  initSort() {
    this.monsters.sort((a, b) => a.level - b.level);
    this.monsters.forEach(m => {
      m.legendaryDrops.sort((a, b) => a.name.localeCompare(b.name));
    })
    this.filterByBossOrRarName();
  }

  openItemComparator() {
    if (this.toCompare.length === 0) {
      this.snackBar.open(this.translate.instant('ITEMS_LIST.COMPARATOR_EMPTY'), "ok", {duration: 3000});
      return;
    }
    let matDialogRef = this.dialog.open(ItemComparatorComponent, {
      width: '1280px',
      minWidth: '1000px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      panelClass: 'rar-comparator-container',
      data: {
        fallBackMonsters: this.fallBackMonsters,
        fallBackEpics: this.fallBackEpics,
        fallBackSets: this.getFallBackSetItems(),
        targetIncrustationStat: this.targetIncrustationStat,
        fallBackLegendaryEpics: this.fallBackLegendaryEpics,
        items: this.toCompare
      }
    });
    matDialogRef.afterClosed();
  }

  getFallBackSetItems() {
    return this.fallBackSets.flatMap(s => s.setLegendaryItems) as IncrustatedLegendaryItem[];
  }

  getPartOfMonsters() {
    return this.monsters.slice(0, this.page * 5);
  }

  doFilter() {
    this.page = 1;
    this.translateItemsAndMonsters(this.translate.currentLang);
    this.optimiseTypesSelect();
    this.validateMinMaxLevels();

    this.filterByBossOrRarName();
    this.filterByItemType();
    this.filterByItemRank();
    this.filterByPhysicalItem();
    this.filterByMagicItem();
    this.filterByMinMaxLevels();
  }

  filterByBossOrRarName() {
    if (!this.searchValue || this.searchValue.trim().length == 0) {
      return;
    }
    let name = this.searchValue.toLowerCase();

    this.monsters = this.monsters.filter(m => {
      if (!m.translatedName) {
        return;
      }
      if (m.translatedName.toLowerCase().includes(name)) {
        return m;
      }
      m.legendaryDrops = m.legendaryDrops.filter(r => {
        if (!r.translatedName) {
          return;
        }
        return r.translatedName.toLowerCase().includes(name);
      });
      if (m.legendaryDrops.length != 0) {
        return m;
      }
      return;
    });
  }

  filterByItemType() {
    let itemTypes = this.searchItemType.filter(t => !t.toString().includes("ALL"));
    if (itemTypes.length == 0) {
      return;
    }

    this.monsters = this.monsters.filter(m => {
      m.legendaryDrops = m.legendaryDrops.filter(r => itemTypes.includes(r.type));
      if (m.legendaryDrops.length != 0) {
        return m;
      }
      return;
    });
  }

  filterByItemRank() {
    if (!this.searchItemRank || this.searchItemRank.length == 0) {
      return;
    }

    this.monsters = this.monsters.filter(m => {
      m.legendaryDrops = m.legendaryDrops.filter(r => this.searchItemRank.includes(r.rank));
      if (m.legendaryDrops.length != 0) {
        return m;
      }
      return;
    });
  }

  filterByMagicItem() {
    if (this.searchMagicItems) {
      return;
    }
    this.monsters = this.monsters.filter(m => {
      m.legendaryDrops = m.legendaryDrops.filter(r => {
        return (((r.power || r.knowledge) || (!r.strength && !r.dexterity)) && r.type !== ItemType.SHIELD);
      });
      if (m.legendaryDrops.length != 0) {
        return m;
      }
      return;
    });
  }

  filterByPhysicalItem() {
    if (this.searchPhysicalItems) {
      return;
    }
    this.monsters = this.monsters.filter(m => {
      m.legendaryDrops = m.legendaryDrops.filter(r => {
        return ((r.strength || r.dexterity) || (!r.power && !r.knowledge) || r.type === ItemType.SHIELD);
      });
      if (m.legendaryDrops.length != 0) {
        return m;
      }
      return;
    });
  }

  filterByMinMaxLevels() {
    if (this.searchMinLvl === 0 && this.searchMaxLvl === 0) {
      return;
    }
    this.monsters = this.monsters.filter(m => {
      m.legendaryDrops = m.legendaryDrops.filter(r => {
        if (r.requiredLevel) {
          if (this.searchMinLvl > 0 && this.searchMaxLvl === 0) {
            return (r.requiredLevel >= this.searchMinLvl);
          }
          if (this.searchMaxLvl > 0 && this.searchMinLvl === 0) {
            return (r.requiredLevel <= this.searchMaxLvl);
          }
        }
        return (r.requiredLevel && r.requiredLevel >= this.searchMinLvl && r.requiredLevel <= this.searchMaxLvl);
      });
      if (m.legendaryDrops.length != 0) {
        return m;
      }
      return;
    });
  }

  changeCurrentItemsType(type: string) {
    this.page = 1;
    this.currentItemsType = type;
  }

  rotateList() {
    this.page = 1;
    this.monsters.sort((m1, m2) => {
      if (!m1.level || !m2.level) {
        return 0;
      }
      if (m1.level > m2.level) {
        if (!this.rotated) {
          return -1;
        }
        return 1;
      }
      if (m1.level < m2.level) {
        if (!this.rotated) {
          return 1;
        }
        return -1;
      }
      return 0;
    });
    this.rotated = !this.rotated;
  }

  validateMinMaxLevels() {
    if (this.searchMinLvl) {
      if (this.searchMinLvl > 140) {
        this.searchMinLvl = 140;
      }
      if (this.searchMinLvl < 0) {
        this.searchMinLvl = 0;
      }
    }
    if (this.searchMaxLvl) {
      if (this.searchMaxLvl > 140) {
        this.searchMaxLvl = 140;
      }
      if (this.searchMaxLvl < 0) {
        this.searchMaxLvl = 0;
      }
      if (this.searchMaxLvl < this.searchMinLvl) {
        this.searchMaxLvl = this.searchMinLvl;
      }
    }

    if (!this.searchMaxLvl) {
      this.searchMaxLvl = 0;
    }
    if (!this.searchMinLvl) {
      this.searchMinLvl = 0;
    }
  }

  getItemTypeKeyArray() {
    let keys: string[] = [];
    for (let key in ItemType) {
      if (!this.isUpperCase(key)) {
        keys.push(key);
      }
    }
    return keys;
  }

  getValueString(n: number) {
    if (n > 0) {
      return "+" + n
    }
    return n;
  }

  getTranslatedName(rar: IncrustatedLegendaryItem) {
    if (rar.family === ItemFamily.RAR) {
      return '"' + rar.translatedName + '"';
    }
    return rar.translatedName;
  }

  isUpperCase(s: string): boolean {
    return s !== s.toUpperCase();
  }

  addToCompare(rar: IncrustatedLegendaryItem) {
    if (this.toCompare.length >= 5) {
      this.snackBar.open(this.translate.instant('ITEMS_LIST.COMPARATOR_FULL'), "ok!", {duration: 3000});
      return;
    }
    this.toCompare.push(cloneDeep(rar));
    this.snackBar.open(this.translate.instant('ITEMS_LIST.COMPARATOR_ADDED', {name: rar.translatedName}), "ok!", {duration: 3000});
  }

  deleteFromToCompare(rar: IncrustatedLegendaryItem) {
    this.toCompare = this.toCompare.filter(r => r !== rar);
    this.snackBar.open(this.translate.instant('ITEMS_LIST.COMPARATOR_REMOVED', {name: rar.translatedName}), "ok!", {duration: 3000});
  }

  removeStar(rar: IncrustatedLegendaryItem) {
    if (!rar.incrustationLevel || rar.incrustationLevel == 1) {
      return;
    }
    rar.incrustationLevel--;

    this.reRollIncrustation(rar);
  }

  addStar(rar: IncrustatedLegendaryItem) {
    if (rar.incrustationLevel == 9) {
      return;
    }
    if (!rar.incrustationLevel) {
      rar.incrustationLevel = 1;
    }
    rar.incrustationLevel++;

    this.reRollIncrustation(rar);
  }

  reRollIncrustation(rar: IncrustatedLegendaryItem) {
    if ( rar.family === ItemFamily.LEGENDARY_EPIC) {
      let epic = this.fallBackLegendaryEpics.find(e => e.name === rar.name);
      this.incrustationService.doIncrustation(rar, this.targetIncrustationStat, undefined, epic);
      return;
    }
    if (rar.family === ItemFamily.EPIC) {
      let epic = this.fallBackEpics.find(e => e.name === rar.name);
      this.incrustationService.doIncrustation(rar, this.targetIncrustationStat, undefined, epic);
      return;
    }
    if (rar.family === ItemFamily.SET) {
      let setItem: IncrustatedLegendaryItem | undefined;
      this.fallBackSets.forEach(s => s.setLegendaryItems.forEach(i => {
        if (!setItem && i.name === rar.name) {
          setItem = i as IncrustatedLegendaryItem;
        }
      }));
      this.incrustationService.doIncrustation(rar, this.targetIncrustationStat, undefined, setItem);
      return;
    }
    this.incrustationService.doIncrustation(rar, this.targetIncrustationStat, this.fallBackMonsters);
  }

  getItemCapacity(rar: IncrustatedLegendaryItem) {
    if (!rar.incrustationLevel || rar.incrustationLevel < 7) {
      return rar.capacity;
    }
    if (rar.incrustationLevel == 7) {
      return rar.capacity + 1;
    }
    if (rar.incrustationLevel == 8) {
      return rar.capacity + 2;
    }
    return rar.capacity + 4;
  }

  selectMulti(multiToSelect: string) {
    let find = this.typeSelector.options.find(o => o.value === multiToSelect);
    if (!find) {
      return;
    }
    let typesToSelect = this.getMultiSelectArray(multiToSelect);
    let selected = find.selected;
    this.typeSelector.options.forEach(o => {
      let contains = typesToSelect.some(s => typesToSelect.includes(o.value));
      if (contains) {
        if (selected) {
          o.select();
        } else {
          o.deselect();
        }
      }
    });
  }

  optimiseTypesSelect() {
    let armors = this.typeSelector.options.find(o => o.value === "ALL_ARMORS");
    let jewelery = this.typeSelector.options.find(o => o.value === "ALL_JEWELERY");
    let weapons = this.typeSelector.options.find(o => o.value === "ALL_WEAPONS");

    this.solveSelection(armors, "ALL_ARMORS");
    this.solveSelection(jewelery, "ALL_JEWELERY");
    this.solveSelection(weapons, "ALL_WEAPONS");
  }

  solveSelection(option: MatOption | undefined, typeFamily: string) {
    if (option) {
      let multiSelectArray = this.getMultiSelectArray(typeFamily);
      let find = this.typeSelector.options.find(o => {
        let itFind = multiSelectArray.find(s => multiSelectArray.includes(o.value));
        if (itFind) {
          return o.selected;
        }
        return false;
      });
      if (!find) {
        option.deselect();
      }
    }
  }

  getMultiSelectArray(multiToSelect: string) {
    switch (multiToSelect) {
      case "ALL_ARMORS": {
        return this.armorTypes;
      }
      case "ALL_JEWELERY": {
        return this.jeweleryTypes;
      }
      case "ALL_WEAPONS": {
        return this.weaponTypes;
      }
      default:
        return [];
    }
  }

  getCustomEpicLore(rar: IncrustatedLegendaryItem) {
    let customEffect = epicsCustomDrifs.find(e => e.epicName === rar.name);
    if (!customEffect) {
      throw new Error('custom epic lore not found');
    }
    return customEffect;
  }

  willBePercent(effect: PsychoMod) {
    if (effect === PsychoMod.EXTRA_AP || effect === PsychoMod.CHEAT_DESTINY) {
      return "";
    }
    return "%";
  }

  saveData() {
    let data: any = {
      modernView: this.modernView,
      toCompare: this.toCompare,
      targetIncrustationStat: this.targetIncrustationStat
    }
    localStorage.setItem("items-list", JSON.stringify(data));
  }

  loadData() {
    let dataString = localStorage.getItem("items-list");
    if (!dataString) {
      return;
    }
    let data: any = JSON.parse(dataString);

    this.modernView = false; //todo: temporary disabled
    this.toCompare = data.toCompare;
    this.targetIncrustationStat = data.targetIncrustationStat;

    if (!this.targetIncrustationStat) {
      this.targetIncrustationStat = IncrustationTarget.EVENLY;
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveData();
  }

  protected readonly ItemFamily = ItemFamily;
  protected readonly Profession = Profession;
  protected readonly IncrustationTarget = IncrustationTarget;
}

const epicsCustomDrifs: customEpicLore[] = [
  {
    epicName: "Żmij",
    customEffect: "Szansa na podwójny atak",
    effectValue: "2%",
    customDrifSizeAndName: "damage_magni",
    customDrifShortName: "teld"
  },
  {
    epicName: "Gorthdar",
    customEffect: "Dodatkowe obrażenia od ognia",
    effectValue: "2%",
    customDrifSizeAndName: "damage_magni",
    customDrifShortName: "unn"
  },
  {
    epicName: "Attawa",
    customEffect: "Modyfikator trafień mentalnych",
    effectValue: "4%",
    customDrifSizeAndName: "accuracy_magni",
    customDrifShortName: "oda"
  },
  {
    epicName: "Imisindo",
    customEffect: "Modyfikator trafień dystansowych",
    effectValue: "4%",
    customDrifSizeAndName: "accuracy_magni",
    customDrifShortName: "ling"
  },
  {
    epicName: "Washi",
    customEffect: "Modyfikator trafień wręcz",
    effectValue: "4%",
    customDrifSizeAndName: "accuracy_magni",
    customDrifShortName: "ulk"
  },
  {
    epicName: "Latarnia Życia",
    customEffect: "Wyssanie many",
    effectValue: "2%",
    customDrifSizeAndName: "special_magni",
    customDrifShortName: "err"
  },
  {
    epicName: "Allenor",
    customEffect: "Modyfikator obrażeń fizycznych",
    effectValue: "2%",
    customDrifSizeAndName: "damage_magni",
    customDrifShortName: "astah"
  },
  ]

export interface customEpicLore {
  epicName: string,
  customEffect: string,
  effectValue: string,
  customDrifSizeAndName: string,
  customDrifShortName: string
}

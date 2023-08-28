import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Monster} from "../../../common/model/gameentites/monster";
import {RarListService} from "./rar-list.service";
import {DamageType} from "../../../common/model/items/damageType";
import {ItemType} from "../../../common/model/items/itemType";
import {MatDialog} from "@angular/material/dialog";
import {ItemComparatorComponent} from "./item-comparator/item-comparator.component";
import {LegendaryItem} from 'src/app/common/model/items/legendaryItem';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-rar-list',
  templateUrl: './rar-list.component.html',
  styleUrls: ['./rar-list.component.scss']
})
export class RarListComponent implements OnInit, OnDestroy {

  protected readonly DamageType = DamageType;
  protected readonly ItemType = ItemType;
  monsters!: Monster[];
  fallBackMonsters!: Monster[];
  searchValue!: string;
  searchItemType!: ItemType[];
  searchItemRank!: number[];
  searchMagicItems: boolean = true;
  searchPhysicalItems: boolean = true;
  modernView: boolean = true;
  ranks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  searchMinLvl: number = 0;
  searchMaxLvl: number = 0;
  toCompare: LegendaryItem[] = [];

  page: number = 1;

  constructor(
    private dialog: MatDialog,
    private rarListService: RarListService,
    private snackBar: MatSnackBar,
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
  }

  ngOnDestroy() {
    this.saveData();
  }

  openItemComparator() {
    if (this.toCompare.length === 0) {
      this.snackBar.open("Porównywarka jest pusta, dodaj coś do niej!", "ok", {duration: 3000});
      return;
    }
    let matDialogRef = this.dialog.open(ItemComparatorComponent, {
      width: '1280px',
      minWidth: '1000px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
      panelClass: 'rar-comparator-container',
      data: {
        items: this.toCompare
      }
    });
    matDialogRef.afterClosed();
  }

  getPartOfMonsters() {
    return this.monsters.slice(0, this.page * 5);
  }

  initData() {
    this.rarListService.getAllMonstersWithLegendaryItems()
      .subscribe(m => {
        this.monsters = m;
        this.fallBackMonsters = m;
        this.initSort();
      });
  }

  initSort() {
    this.monsters.forEach(m => {
      m.legendaryDrops.sort((a, b) => a.name.localeCompare(b.name));
    })
    this.filterByBossOrRarName();
  }

  doFilter() {
    this.page = 1;
    this.monsters = [];
    this.fallBackMonsters.forEach(fbm => this.monsters.push(Object.assign({}, fbm)));
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
      if (m.name.toLowerCase().includes(name)) {
        return m;
      }
      m.legendaryDrops = m.legendaryDrops.filter(r => r.name.toLowerCase().includes(name));
      if (m.legendaryDrops.length != 0) {
        return m;
      }
      return;
    });
  }

  filterByItemType() {
    if (!this.searchItemType || this.searchItemType.length == 0) {
      return;
    }

    this.monsters = this.monsters.filter(m => {
      m.legendaryDrops = m.legendaryDrops.filter(r => this.searchItemType.includes(r.type));
      if (m.legendaryDrops.length != 0) {
        return m;
      }
      return;
    });
  }

  filterByItemRank() {
    if (!this.searchItemRank  || this.searchItemRank.length == 0) {
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
        return (((r.power || r.knowledge) || (!r.strength && !r.dexterity)) && ItemType[r.type].toString() !== ItemType.SHIELD.toString());
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
        return ((r.strength || r.dexterity) || (!r.power && !r.knowledge) || ItemType[r.type].toString() === ItemType.SHIELD.toString());
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

  convertArabianToRomanNumber(arabianNumber: number) {
    switch (arabianNumber) {
      case 1: return "I";
      case 2: return "II";
      case 3: return "III";
      case 4: return "IV";
      case 5: return "V";
      case 6: return "VI";
      case 7: return "VII";
      case 8: return "VIII";
      case 9: return "IX";
      case 10: return "X";
      case 11: return "XI";
      case 12: return "XII";
      default: return "I";
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

  getItemTypeValueByKey(key: string) {
    return ItemType[key as keyof typeof ItemType];
  }

  isUpperCase(s: string): boolean {
    return s !== s.toUpperCase();
  }

  isInToCompare(rar: LegendaryItem) {
    let find = this.toCompare.find(r => r.id  === rar.id);
    if (find) {
      return "accent";
    }
    return;
  }

  addToCompare(rar: LegendaryItem) {
    let find = this.toCompare.find(r => r.id  === rar.id);
    if (!find) {
      if (this.toCompare.length >= 5) {
        this.snackBar.open("W porównywarce znajduje się maksymalna ilość przedmiotów (5)", "ok!", {duration: 3000});
        return;
      }
      this.toCompare.push(rar);
      this.snackBar.open("Dodano " + rar.name + " do porównywarki", "ok!", {duration: 3000});
      return;
    }
    this.toCompare = this.toCompare.filter(r => r.id !== rar.id);
    this.snackBar.open("Przedmiot " + rar.name + " został usunięty z porównywarki", "ok!", {duration: 3000});
  }

  deleteFromToCompare(rar: LegendaryItem) {
    this.toCompare = this.toCompare.filter(r => r.id !== rar.id);
    this.snackBar.open("Przedmiot " + rar.name + " został usunięty z porównywarki", "ok!", {duration: 3000});
  }

  saveData() {
    let data: any = {
      modernView: this.modernView,
      toCompare: this.toCompare
    }
    localStorage.setItem("items-list", JSON.stringify(data));
  }

  loadData() {
    let dataString = localStorage.getItem("items-list");
    if (!dataString) {
      return;
    }
    let data: any = JSON.parse(dataString);

    this.modernView = data.modernView;
    this.toCompare = data.toCompare;
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveData();
  }
}

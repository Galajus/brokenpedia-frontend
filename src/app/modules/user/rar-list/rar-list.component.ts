import {Component, OnInit} from '@angular/core';
import {Monster} from "../../../common/model/gameentites/monster";
import {RarListService} from "./rar-list.service";
import {DamageType} from "../../../common/model/items/damageType";
import {ItemType} from "../../../common/model/items/itemType";

@Component({
  selector: 'app-rar-list',
  templateUrl: './rar-list.component.html',
  styleUrls: ['./rar-list.component.scss']
})
export class RarListComponent implements OnInit {

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
  ranks: number[] = [1, 2 ,3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  searchMinLvl: number = 0;
  searchMaxLvl: number = 0;

  page: number = 1;

  constructor(
    private rarListService: RarListService
  ) {
  }

  ngOnInit(): void {
    this.initData();

    const scroller = document.querySelector("#pageContent");

    scroller?.addEventListener("scroll", (event) => {
      if ((scroller.scrollHeight - scroller.scrollTop) < 1500) {
        if (this.monsters.length > this.page * 5) {
          this.page++;
        }
      }
    });
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
    if (n >= 0) {
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

}

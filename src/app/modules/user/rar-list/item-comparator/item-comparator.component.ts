import {Component, Inject, OnInit} from '@angular/core';
import {LegendaryItem} from "../../../../common/model/items/legendaryItem";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ItemType} from "../../../../common/model/items/itemType";
import {DamageType} from "../../../../common/model/items/damageType";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {IncrustatedLegendaryItem} from "../model/incrustatedLegendaryItem";
import {round} from "lodash-es";
import {MonsterWithIncrustatedLegendaryItems} from "../model/monsterWithIncrustatedLegendaryItems";
import {RarListIncrustationService} from "../rar-list-incrustation.service";

@Component({
  selector: 'app-item-comparator',
  templateUrl: './item-comparator.component.html',
  styleUrls: ['./item-comparator.component.scss']
})
export class ItemComparatorComponent implements OnInit {

  toCompare: IncrustatedLegendaryItem[] = [];
  fallBackMonsters!: MonsterWithIncrustatedLegendaryItems[];
  targetIncrustationStat: string = "evenly";

  protected readonly ItemType = ItemType;
  protected readonly Array = Array;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private incrustationService: RarListIncrustationService
  ) {
    this.toCompare = data.items;
    this.fallBackMonsters = data.fallBackMonsters;
    this.targetIncrustationStat = data.targetIncrustationStat;
  }

  ngOnInit(): void {
  }

  removeStar(rar: IncrustatedLegendaryItem) {
    if (!rar.incrustationLevel || rar.incrustationLevel == 1) {
      return;
    }
    rar.incrustationLevel--;
    this.incrustationService.doIncrustation(rar, this.fallBackMonsters, this.targetIncrustationStat);
  }

  addStar(rar: IncrustatedLegendaryItem) {
    if (rar.incrustationLevel == 9) {
      return;
    }
    if (!rar.incrustationLevel) {
      rar.incrustationLevel = 1;
    }
    rar.incrustationLevel++;
    this.incrustationService.doIncrustation(rar, this.fallBackMonsters, this.targetIncrustationStat);
  }

  reRollIncrustation(rar: IncrustatedLegendaryItem) {
    this.incrustationService.doIncrustation(rar, this.fallBackMonsters, this.targetIncrustationStat);
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

  drop(event: CdkDragDrop<IncrustatedLegendaryItem[], any>) {
    moveItemInArray(this.toCompare, event.previousIndex, event.currentIndex);
  }

  getCompare(comparingStat: string, rar: IncrustatedLegendaryItem) {
    let firstElement = this.toCompare[0];

    let firstStatNumber = this.getNumberFieldValue(firstElement, comparingStat);
    let firstStatString = this.getStringFieldValue(firstElement, comparingStat);
    let statNumber = this.getNumberFieldValue(rar, comparingStat);
    let statString = this.getStringFieldValue(rar, comparingStat);

    if (!firstStatNumber) {
      firstStatNumber = 0;
    }
    if (!statNumber) {
      statNumber = 0;
    }
    if (!firstStatString) {

    }
    if (!statString) {

    }

    switch (comparingStat) {
      case "weight": {
        if (statNumber == firstStatNumber) {
          return "";
        }
        let difference = -(firstStatNumber - statNumber);
        if (difference < 0) {
          return "<div style='color: #32d500; font-weight: bold'>&nbsp;(" + difference + ")</div>";
        }
        return "<div style='color: red; font-weight: bold'>&nbsp;(+" + difference + ")</div>";
      }

      case "value":
      case "requiredLevel":
      case "requiredStrength":
      case "requiredDexterity":
      case "requiredPower":
      case "requiredKnowledge": {
        if (statNumber === firstStatNumber) {
          return "";
        }
        let difference = -(firstStatNumber - statNumber);

        if (difference < 0) {
          return "<div style='color: #8c6f50; font-weight: bold'>&nbsp;(" + difference.toLocaleString() + ")</div>";
        }
        return "<div style='color: #8c6f50; font-weight: bold'>&nbsp;(+" + difference.toLocaleString() + ")</div>";
      }

      case "rank":
      case "capacity":
      case "damage":
      case "strength":
      case "dexterity":
      case "power":
      case "knowledge":
      case "health":
      case "mana":
      case "stamina":
      case "armorSlashing":
      case "armorCrushing":
      case "armorPiercing":
      case "mentalResistance":
      case "fireResistance":
      case "energyResistance":
      case "coldResistance": {
        if (statNumber === firstStatNumber) {
          return "";
        }
        let difference = firstStatNumber - statNumber;
        if (difference < 0) {
          return "<div style='color: #32d500; font-weight: bold'>&nbsp;(+" + -(difference) + ")</div>";
        }
        return "<div style='color: red; font-weight: bold'>&nbsp;(" + -(difference) + ")</div>";
      }

      case "type":
      case "damageType": {
        if (!statString || statString == firstStatString) {
          return "";
        }
        return "<div style='color: yellow; font-weight: bold'>&nbsp;*</div>";
      }
    }
    return "";
  }

  getStringFieldValue(object: IncrustatedLegendaryItem, field: string) {
    for (const key in object) {
      if(key === field) {
        // @ts-ignore
        return object[key];
      }
    }
    return "";
  }

  getNumberFieldValue(object: IncrustatedLegendaryItem, field: string) {
    if (field === "capacity") {
      return this.getItemCapacity(object);
    }
    for (const key in object) {
      if(key === field) {
        // @ts-ignore
        return Number.parseInt(object[key]);
      }
    }
    return 0;
  }

  getValueString(n: number | undefined) {
    if (!n) {
      return 0;
    }
    if (n > 0) {
      return "+" + n
    }
    return n;
  }

  getDamageType(damageType: DamageType | undefined) {
    if (!damageType) {
      return "";
    }
    return DamageType[damageType];
  }

  getIsBelowZero(stat: number | undefined) {
    if (!stat) {
      return false;
    }
    return stat < 0;
  }

  getStatSum(rar: LegendaryItem) {
    let sumStat = 0;
    if (rar.strength) {
      sumStat += rar.strength;
    }
    if (rar.dexterity) {
      sumStat += rar.dexterity;
    }
    if (rar.power) {
      sumStat += rar.power;
    }
    if (rar.knowledge) {
      sumStat += rar.knowledge;
    }
    if (rar.health) {
      sumStat += rar.health / 10;
    }
    if (rar.mana) {
      sumStat += rar.mana / 10;
    }
    if (rar.stamina) {
      sumStat += rar.stamina / 10;
    }
    return "∑ " + round(sumStat, 1);
  }

  getArmorSum(rar: LegendaryItem) {
    let sumStat = 0;
    if (rar.armorSlashing) {
      sumStat += rar.armorSlashing;
    }
    if (rar.armorCrushing) {
      sumStat += rar.armorCrushing;
    }
    if (rar.armorPiercing) {
      sumStat += rar.armorPiercing;
    }
    return "∑ " + round(sumStat, 1);
  }

  getResistanceSum(rar: LegendaryItem) {
    let sumStat = 0;
    if (rar.mentalResistance) {
      sumStat += rar.mentalResistance;
    }
    if (rar.fireResistance) {
      sumStat += rar.fireResistance;
    }
    if (rar.energyResistance) {
      sumStat += rar.energyResistance;
    }
    if (rar.coldResistance) {
      sumStat += rar.coldResistance;
    }
    return "∑ " + round(sumStat, 1);
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
}

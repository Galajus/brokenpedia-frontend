import {Injectable} from '@angular/core';
import {StatHolder} from "@models/incrustation/statHolder";
import {IncrustatedLegendaryItem} from "@models/items/incrustatedLegendaryItem";
import {cloneDeep, round} from "lodash-es";
import {IncrustationBoost} from "@models/incrustation/incrustationBoost";
import {ItemFamily} from "@models/items/itemFamily";
import {LegendaryItem} from "@models/items/legendaryItem";
import {MonsterWithIncrustatedLegendaryItems} from "@models/gameentites/monster";

@Injectable({
  providedIn: 'root'
})
export class RarIncrustationService {

  constructor() { }

  incrustationBoost: IncrustationBoost[] = [
    {
      level: 1,
      statBoost: 0,
      legendaryDamageBoost: 0,
      epicDamageBoost: 0,
      upgradeBoost: 0,
      capacityBoost: 0,
      extraDrifSlot: false
    },
    {
      level: 2,
      statBoost: 0.03,
      legendaryDamageBoost: 0.015,
      epicDamageBoost: 0.03,
      upgradeBoost: 0,
      capacityBoost: 0,
      extraDrifSlot: false
    },
    {
      level: 3,
      statBoost: 0.06,
      legendaryDamageBoost: 0.03,
      epicDamageBoost: 0.06,
      upgradeBoost: 0,
      capacityBoost: 0,
      extraDrifSlot: false
    },
    {
      level: 4,
      statBoost: 0.1,
      legendaryDamageBoost: 0.05,
      epicDamageBoost: 0.1,
      upgradeBoost: 0.1,
      capacityBoost: 0,
      extraDrifSlot: false
    },
    {
      level: 5,
      statBoost: 0.15,
      legendaryDamageBoost: 0.075,
      epicDamageBoost: 0.15,
      upgradeBoost: 0.15,
      capacityBoost: 0,
      extraDrifSlot: false
    },
    {
      level: 6,
      statBoost: 0.2,
      legendaryDamageBoost: 0.1,
      epicDamageBoost: 0.2,
      upgradeBoost: 0.25,
      capacityBoost: 0,
      extraDrifSlot: false
    },
    {
      level: 7,
      statBoost: 0.25,
      legendaryDamageBoost: 0.125,
      epicDamageBoost: 0.25,
      upgradeBoost: 0.50,
      capacityBoost: 1,
      extraDrifSlot: true
    },
    {
      level: 8,
      statBoost: 0.35,
      legendaryDamageBoost: 0.175,
      epicDamageBoost: 0.35,
      upgradeBoost: 0.8,
      capacityBoost: 2,
      extraDrifSlot: true
    },
    {
      level: 9,
      statBoost: 0.5,
      legendaryDamageBoost: 0.25,
      epicDamageBoost: 0.5,
      upgradeBoost: 1,
      capacityBoost: 4,
      extraDrifSlot: true
    }
  ];

  doIncrustation(rar: IncrustatedLegendaryItem, targetIncrustationStat: string, fallBackMonsters?: MonsterWithIncrustatedLegendaryItems[], originalItem?: IncrustatedLegendaryItem) {
    let originalRarClone: IncrustatedLegendaryItem | undefined;

    if (!originalItem) {
      if (!fallBackMonsters) {
        return;
      }
      originalRarClone = this.findOriginalRar(rar, fallBackMonsters);
    } else {
      originalRarClone = cloneDeep(originalItem);
    }

    if (!originalRarClone) {
      return;
    }
    let incrustationLevel = rar.incrustationLevel;
    if (!incrustationLevel || incrustationLevel == 1) {
      this.overrideRarStats(rar, originalRarClone);
      return;
    }
    let booster = this.incrustationBoost.find(boost => boost.level === incrustationLevel);
    if (!booster) {
      return;
    }

    let statHolder = this.createStatHolder(originalRarClone);
    let armorHolder = this.createArmorHolder(originalRarClone);
    let resistHolder = this.createResistHolder(originalRarClone);

    this.insertNewStatsToHolder(incrustationLevel, statHolder, targetIncrustationStat);
    this.insertNewStatsToHolder(incrustationLevel, armorHolder, targetIncrustationStat);
    this.insertNewStatsToHolder(incrustationLevel, resistHolder, targetIncrustationStat);
    this.insertNewStatsToRar(rar, statHolder);
    this.insertNewArmorsToRar(rar, armorHolder);
    this.insertNewResistsToRar(rar, resistHolder);

    if (originalRarClone.damage) {
      if (rar.family === ItemFamily.EPIC) {
        rar.damage = Math.ceil(originalRarClone.damage * (booster.epicDamageBoost + 1));
      } else {
        rar.damage = Math.ceil(originalRarClone.damage * (booster.legendaryDamageBoost + 1));
      }
    }
  }

  findOriginalRar(rar: IncrustatedLegendaryItem, fallBackMonsters: MonsterWithIncrustatedLegendaryItems[]) {
    let droppingMonster = fallBackMonsters.find(m => m.legendaryDrops.find(l => l.id == rar.id));
    if (!droppingMonster) {
      return;
    }
    let originalRar = droppingMonster.legendaryDrops.find(r => r.id === rar.id);
    if (!originalRar) {
      return;
    }
    return cloneDeep(originalRar);
  }

  private incrustateEvenly(fullStat: number, remainingStat: number, statHolder: StatHolder[]) {
    for (let i = 0; i < fullStat; i++) {
      let pushTo = i % statHolder.length;
      let holder = statHolder[pushTo];
      if (holder.isBy10) {
        holder.stat += 10;
        continue;
      }
      holder.stat++;
    }
    if (remainingStat != 0) {
      let byTenStats = statHolder.filter(h => h.isBy10);
      if (byTenStats.length == 0) {
        return;
      }
      for (let i = 0; i < remainingStat; i++) {
        byTenStats[i % byTenStats.length].stat++;
      }

      /*let pushToRemaining = Math.floor(Math.random() * byTenStats.length);
      byTenStats[pushToRemaining].stat += remainingStat;*/
    }
  }

  private incrustateRandom(fullStat: number, remainingStat: number, statHolder: StatHolder[]) {
    for (let i = 0; i < fullStat; i++) {
      let pushTo = Math.floor(Math.random() * statHolder.length);
      let holder = statHolder[pushTo];
      if (holder.isBy10) {
        holder.stat += 10;
        continue;
      }
      holder.stat++;
    }

    if (remainingStat != 0) {
      let byTenStats = statHolder.filter(h => h.isBy10);
      if (byTenStats.length == 0) {
        return;
      }
      for (let i = 0; i < remainingStat; i++) {
        byTenStats[Math.floor(Math.random() * byTenStats.length)].stat++;
      }
    }
  }

  private incrustateSelected(fullStat: number, remainingStat: number, statHolder: StatHolder[], targetIncrustationStat: string) {
    let holder = statHolder.find(h => h.name === targetIncrustationStat);
    if (!holder) {
      this.incrustateEvenly(fullStat, remainingStat, statHolder);
      return;
    }
    if (holder.isBy10) {
      holder.stat += fullStat * 10;
    } else {
      holder.stat += fullStat;
    }

    if (remainingStat != 0) {
      let byTenStats: StatHolder[];
      if (targetIncrustationStat === "health" || targetIncrustationStat === "mana" || targetIncrustationStat === "stamina") {
        byTenStats = statHolder.filter(h => h.name && h.name == targetIncrustationStat);
      } else {
        byTenStats = statHolder.filter(h => h.isBy10);
      }
      if (byTenStats.length == 0) {
        return;
      }
      for (let i = 0; i < remainingStat; i++) {
        byTenStats[i % byTenStats.length].stat++;
      }
    }
  }

  insertNewStatsToHolder(incrustationLevel: number | undefined, statHolder: StatHolder[], targetIncrustationStat: string) {
    if (!incrustationLevel || !statHolder || statHolder.length == 0) {
      return;
    }

    let statSumBy10 = statHolder
      .map(holder => {
        if (holder.isBy10) {
          return holder.stat;
        }
        return holder.stat * 10;
      })
      .reduce((a, b) => a + b);

    let statToAppend = 0;
    for (let i = 2; i < incrustationLevel + 1; i++) {
      let targetBoost = this.incrustationBoost.find(b => b.level === i);
      let previousBoost = this.incrustationBoost.find(b => b.level === i - 1);
      if (!targetBoost || !previousBoost) {
        console.log("BOOSTERS ERROR")
        return;
      }
      let toBoost = targetBoost.statBoost - previousBoost.statBoost;


      if (!statHolder[0].name) {
        let roundedThreeDigits = round(((statSumBy10 * toBoost) / 10), 3);
        let realAppend = Math.ceil((roundedThreeDigits)) * 10;
        statToAppend += realAppend;
        continue;
      }
      let realAppend = Math.ceil(statSumBy10 * toBoost);
      statToAppend += realAppend;
    }
    /* let statToAppend = statSumBy10 * booster.statBoost;
     let fullStat = Math.floor(statToAppend / 10);
     let remainingStat = statToAppend % 10;
     remainingStat = Math.ceil(remainingStat);*/
    let fullStat = Math.floor(statToAppend / 10);
    let remainingStat = Math.ceil(statToAppend % 10);

    if (targetIncrustationStat == "evenly") {
      this.incrustateEvenly(fullStat, remainingStat, statHolder);
      return;
    }
    if (targetIncrustationStat == "random") {
      this.incrustateRandom(fullStat, remainingStat, statHolder);
      return;
    }

    this.incrustateSelected(fullStat, remainingStat, statHolder, targetIncrustationStat);

  }

  private insertNewStatsToRar(rar: LegendaryItem, holder: StatHolder[]) {
    if (!holder || holder.length == 0) {
      return;
    }
    let occurrences = 0;
    if (rar.strength || rar.strength == 0) {
      rar.strength = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.dexterity || rar.dexterity == 0) {
      rar.dexterity = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.power || rar.power == 0) {
      rar.power = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.knowledge || rar.knowledge == 0) {
      rar.knowledge = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.health || rar.health == 0) {
      rar.health = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.mana || rar.mana == 0) {
      rar.mana = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.stamina || rar.stamina == 0) {
      rar.stamina = holder[occurrences].stat;
      occurrences++;
    }
  }

  private createStatHolder(originalRar: IncrustatedLegendaryItem) {
    let statHolder: StatHolder[] = [];
    if (originalRar.strength) {
      statHolder.push({
        name: "strength",
        stat: originalRar.strength,
        isBy10: false
      });
    }
    if (originalRar.dexterity) {
      statHolder.push({
        name: "dexterity",
        stat: originalRar.dexterity,
        isBy10: false
      });
    }
    if (originalRar.power) {
      statHolder.push({
        name: "power",
        stat: originalRar.power,
        isBy10: false
      });
    }
    if (originalRar.knowledge) {
      statHolder.push({
        name: "knowledge",
        stat: originalRar.knowledge,
        isBy10: false
      });
    }
    if (originalRar.health) {
      statHolder.push({
        name: "health",
        stat: originalRar.health,
        isBy10: true
      });
    }
    if (originalRar.mana) {
      statHolder.push({
        name: "mana",
        stat: originalRar.mana,
        isBy10: true
      });
    }
    if (originalRar.stamina) {
      statHolder.push({
        name: "stamina",
        stat: originalRar.stamina,
        isBy10: true
      });
    }
    return statHolder;
  }

  private createArmorHolder(originalRar: IncrustatedLegendaryItem) {
    let armorHolder: StatHolder[] = [];
    if (originalRar.armorSlashing) {
      armorHolder.push({
        stat: originalRar.armorSlashing,
        isBy10: false
      });
    }
    if (originalRar.armorCrushing) {
      armorHolder.push({
        stat: originalRar.armorCrushing,
        isBy10: false
      });
    }
    if (originalRar.armorPiercing) {
      armorHolder.push({
        stat: originalRar.armorPiercing,
        isBy10: false
      });
    }
    return armorHolder;
  }

  private createResistHolder(originalRar: IncrustatedLegendaryItem) {
    let resistHolder: StatHolder[] = [];
    if (originalRar.mentalResistance) {
      resistHolder.push({
        stat: originalRar.mentalResistance,
        isBy10: false
      });
    }
    if (originalRar.fireResistance) {
      resistHolder.push({
        stat: originalRar.fireResistance,
        isBy10: false
      });
    }
    if (originalRar.energyResistance) {
      resistHolder.push({
        stat: originalRar.energyResistance,
        isBy10: false
      });
    }
    if (originalRar.coldResistance) {
      resistHolder.push({
        stat: originalRar.coldResistance,
        isBy10: false
      });
    }
    return resistHolder;
  }

  private insertNewArmorsToRar(rar: LegendaryItem, holder: StatHolder[]) {
    if (!holder || holder.length == 0) {
      return;
    }
    let occurrences = 0;
    if (rar.armorSlashing) {
      rar.armorSlashing = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.armorCrushing) {
      rar.armorCrushing = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.armorPiercing) {
      rar.armorPiercing = holder[occurrences].stat;
      occurrences++;
    }
  }

  private insertNewResistsToRar(rar: LegendaryItem, holder: StatHolder[]) {
    if (!holder || holder.length == 0) {
      return;
    }
    let occurrences = 0;
    if (rar.mentalResistance) {
      rar.mentalResistance = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.fireResistance) {
      rar.fireResistance = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.energyResistance) {
      rar.energyResistance = holder[occurrences].stat;
      occurrences++;
    }
    if (rar.coldResistance) {
      rar.coldResistance = holder[occurrences].stat;
      occurrences++;
    }
  }

  private overrideRarStats(oldRar: IncrustatedLegendaryItem, newRar: IncrustatedLegendaryItem) {
    oldRar.capacity = newRar.capacity;
    oldRar.damage = newRar.damage;
    oldRar.strength = newRar.strength;
    oldRar.dexterity = newRar.dexterity;
    oldRar.power = newRar.power;
    oldRar.knowledge = newRar.knowledge;
    oldRar.health = newRar.health;
    oldRar.mana = newRar.mana;
    oldRar.stamina = newRar.stamina;
    oldRar.armorSlashing = newRar.armorSlashing;
    oldRar.armorCrushing = newRar.armorCrushing;
    oldRar.armorPiercing = newRar.armorPiercing;
    oldRar.mentalResistance = newRar.mentalResistance;
    oldRar.fireResistance = newRar.fireResistance;
    oldRar.energyResistance = newRar.energyResistance;
    oldRar.coldResistance = newRar.coldResistance;
  }

}

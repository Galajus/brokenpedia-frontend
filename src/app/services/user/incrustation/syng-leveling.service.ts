import {Injectable} from '@angular/core';
import {InventoryItem} from "@models/build-calculator/inventory/inventory";
import {ItemType} from "@models/items/itemType";
import {
  armorSyngProgress,
  resSyngProgress,
  statSyngProgress, SynergeticProgress,
  SynergeticUpgradeData, syngData,
  SyngType
} from "@models/incrustation/synergeticUpgrade";
import {floor, round} from "lodash-es";
import {IncrustatedLegendaryItem} from "@models/items/incrustatedLegendaryItem";
import {ItemRewriterService} from "@services/user/incrustation/item-rewriter.service";

@Injectable({
  providedIn: 'root'
})
export class SyngLevelingService {

  constructor(
    private itemRewriter: ItemRewriterService
  ) { }

  changeSyngLevel(item: InventoryItem, original: IncrustatedLegendaryItem) {
    const syngType: SyngType = this.getSyngType(item);
    const statsToBoost = this.getStatsToBoost(item.incrustationLevel, syngType);

    this.itemRewriter.overrideItemStats(item, original);

    this.assignBoostsToItem(item, statsToBoost);
    this.assignSyngData(item, original);
  }

  getRequirements(item: InventoryItem, level: number) {
    const data = syngData.find(data => data.level === level * 10);
    if (!data) {
      throw new Error("Cant find syng data!");
    }
    const syngType = this.getSyngType(item);
    if (syngType === SyngType.RES) {
      data.requiredAccuracyStat = 0;
      data.requiredOffenseStat = 0;
    }
    return data;
  }

  isMagicSyng(item: InventoryItem) {
    return !!(item.knowledge || item.power);
  }

  private assignBoostsToItem(item: InventoryItem, statsToBoost: SynergeticUpgradeData) {
    this.assignStats(item, statsToBoost.statsEvenly);
    this.assignResources(item, statsToBoost.resourcesEvenly);
    this.assignArmors(item, statsToBoost.armorsEvenly);
    this.assignResistances(item, statsToBoost.resistsEvenly);
  }

  private assignSyngData(item: InventoryItem, original: IncrustatedLegendaryItem) {
    const data = this.getRequirements(item, item.incrustationLevel);

    if (data.suffix) {
      item.name = original.name + " " + data.suffix;
    } else {
      item.name = original.name;
    }

    item.requiredLevel = item.incrustationLevel * 10;

    if (item.requiredPower) {
      item.requiredPower = data.requiredOffenseStat;
    }
    if (item.requiredKnowledge) {
      item.requiredKnowledge = data.requiredAccuracyStat;
    }
    if (item.requiredStrength) {
      item.requiredStrength = data.requiredOffenseStat;
    }
    if (item.requiredDexterity) {
      item.requiredDexterity = data.requiredAccuracyStat;
    }

    item.value = data.value;
    item.rank = data.rank;
  }

  private assignStats(item: InventoryItem, amount: number) {
    let typesToIncrease = 0;
    if (item.strength) {
      typesToIncrease++;
    }
    if (item.dexterity) {
      typesToIncrease++;
    }
    if (item.power) {
      typesToIncrease++;
    }
    if (item.knowledge) {
      typesToIncrease++;
    }

    const increasePerStat = floor(amount / typesToIncrease, 0);
    let additional = amount % typesToIncrease;

    if (item.strength || item.strength === 0) {
      item.strength += increasePerStat;
    }
    if (item.dexterity || item.dexterity === 0) {
      item.dexterity += increasePerStat;
    }
    if (item.power || item.power === 0) {
      item.power += increasePerStat;
    }
    if (item.knowledge || item.knowledge === 0) {
      item.knowledge += increasePerStat;
    }

    if ((item.strength || item.strength === 0) && additional > 0) {
      item.strength++;
      additional--;
    }
    if ((item.dexterity || item.dexterity === 0) && additional > 0) {
      item.dexterity++;
      additional--;
    }
    if ((item.power || item.power === 0) && additional > 0) {
      item.power++;
      additional--;
    }
    if ((item.knowledge || item.knowledge === 0) && additional > 0) {
      item.knowledge++;
      additional--;
    }
  }

  private assignResources(item: InventoryItem, amount: number) {
    let typesToIncrease = 0;
    if (item.health || item.health === 0) {
      typesToIncrease++;
    }
    if (item.stamina || item.stamina === 0) {
      typesToIncrease++;
    }
    if (item.mana || item.mana === 0) {
      typesToIncrease++;
    }

    const increasePerStat = floor(amount / typesToIncrease, 0);
    let additional = amount % typesToIncrease;

    if (item.health || item.health === 0) {
      item.health += increasePerStat * 10;
    }
    if (item.stamina || item.stamina === 0) {
      item.stamina += increasePerStat * 10;
    }
    if (item.mana || item.mana === 0) {
      item.mana += increasePerStat * 10;
    }

    if ((item.health || item.health === 0) && additional > 0) {
      item.health += 10;
      additional--;
    }
    if ((item.stamina || item.stamina === 0) && additional > 0) {
      item.stamina += 10;
      additional--;
    }
    if ((item.mana || item.mana === 0) && additional > 0) {
      item.mana += 10;
      additional--;
    }

    //todo resources spread
  }

  private assignArmors(item: InventoryItem, amount: number) {
    let typesToIncrease = 3;


    const increasePerStat = floor(amount / typesToIncrease, 0);
    let additional = amount % typesToIncrease;

    if (item.armorCrushing) {
      item.armorCrushing += increasePerStat;
    }
    if (item.armorPiercing) {
      item.armorPiercing += increasePerStat;
    }
    if (item.armorSlashing) {
      item.armorSlashing += increasePerStat;
    }

    if (item.armorCrushing && additional > 0) {
      item.armorCrushing++;
      additional--;
    }
    if (item.armorPiercing && additional > 0) {
      item.armorPiercing++;
      additional--;
    }
    if (item.armorSlashing && additional > 0) {
      item.armorSlashing++;
      additional--;
    }
  }

  private assignResistances(item: InventoryItem, amount: number) {
    let typesToIncrease = 4;

    const increasePerStat = floor(amount / typesToIncrease, 0);
    let additional = amount % typesToIncrease;

    if (item.mentalResistance) {
      item.mentalResistance += increasePerStat;
    }
    if (item.fireResistance) {
      item.fireResistance += increasePerStat;
    }
    if (item.coldResistance) {
      item.coldResistance += increasePerStat;
    }
    if (item.energyResistance) {
      item.energyResistance += increasePerStat;
    }

    if (item.mentalResistance && additional > 0) {
      item.mentalResistance++;
      additional--;
    }
    if (item.fireResistance && additional > 0) {
      item.fireResistance++;
      additional--;
    }
    if (item.coldResistance && additional > 0) {
      item.coldResistance++;
      additional--;
    }
    if (item.energyResistance && additional > 0) {
      item.energyResistance++;
      additional--;
    }
  }

  private getStatsToBoost(itemLevel: number, syngType: SyngType) {
    const boostData: SynergeticUpgradeData = {
      statsEvenly: 0,
      statsMin: 0,
      statsMax: 0,

      resourcesEvenly: 0,
      resourcesMin: 0,
      resourcesMax: 0,

      resistsEvenly: 0,
      resistsMin: 0,
      resistsMax: 0,

      armorsEvenly: 0,
      armorsMin: 0,
      armorsMax: 0
    };

    let level = 2;

    while (level < itemLevel) {
      if (syngType === SyngType.STAT) {
        const progress = statSyngProgress.find(p => p.mergingLevel === level);
        if (!progress) {
          throw new Error("STAT PROGRESS NOT FOUND!");
        }
        this.insertDataToProgress(boostData, progress);
      }
      if (syngType === SyngType.RES) {
        const progress = resSyngProgress.find(p => p.mergingLevel === level);
        if (!progress) {
          throw new Error("RES PROGRESS NOT FOUND!");
        }
        this.insertDataToProgress(boostData, progress);
      }
      if (syngType === SyngType.ARMOR) {
        const progress = armorSyngProgress.find(p => p.mergingLevel === level);
        if (!progress) {
          throw new Error("ARMOR PROGRESS NOT FOUND!");
        }
        this.insertDataToProgress(boostData, progress);
      }
      level++;
    }
    return boostData;
  }

  private insertDataToProgress(boostData: SynergeticUpgradeData, progress: SynergeticProgress) {
    if (progress.stats) {
      boostData.statsEvenly += progress.stats;
      boostData.statsMax += progress.stats;
      boostData.statsMin += progress.stats;
    }
    if (progress.resources) {
      const spread = round(progress.resources * 0.2, 1);
      boostData.resourcesEvenly += progress.resources;
      boostData.resourcesMax += progress.resources + spread;
      boostData.resourcesMin += progress.resources - spread;
    }
    if (progress.resists) {
      boostData.resistsEvenly += progress.resists;
      boostData.resistsMax += progress.resists;
      boostData.resistsMin += progress.resists;
    }
    if (progress.armors) {
      boostData.armorsEvenly += progress.armors;
      boostData.armorsMax += progress.armors;
      boostData.armorsMin += progress.armors;
    }
  }

  private getSyngType(item: InventoryItem) {
    if (this.isArmorItem(item)) {
      return SyngType.ARMOR;
    }
    if (this.isResItem(item)) {
      return SyngType.RES;
    }
    return SyngType.STAT;
  }

  private isArmorItem(item: InventoryItem) {
    switch (item.type) {
      case ItemType.ARMOR: return true;
      case ItemType.HELMET: return true;
      case ItemType.PANTS: return true;
      case ItemType.BOOTS: return true;
    }
    return false;
  }

  private isResItem(item: InventoryItem) {
    const c = item.coldResistance;
    const f = item.fireResistance;
    const e = item.energyResistance;
    const m = item.mentalResistance;
    return !!(c || f || e || m);

  }

}

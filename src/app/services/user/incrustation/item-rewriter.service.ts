import { Injectable } from '@angular/core';
import {IncrustatedLegendaryItem} from "@models/items/incrustatedLegendaryItem";
import {InventoryItem} from "@models/build-calculator/inventory/inventory";

@Injectable({
  providedIn: 'root'
})
export class ItemRewriterService {

  constructor() { }

  overrideItemStats(oldRar: IncrustatedLegendaryItem | InventoryItem, newRar: IncrustatedLegendaryItem | InventoryItem) {
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

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {InventoryService} from "../../../../services/admin/inventory/inventory.service";
import {MonsterService} from "../../../../services/admin/monsters/monster.service";
import {Monster} from "../../../../models/gameentites/monster";
import {LegendaryItem} from "../../../../models/items/legendaryItem";
import {ItemType} from "../../../../models/items/itemType";
import {DamageType} from "../../../../models/items/damageType";
import {ItemFamily} from "../../../../models/items/itemFamily";

@Component({
  selector: 'app-create-rar',
  templateUrl: './create-rar.component.html',
  styleUrls: ['./create-rar.component.scss']
})
export class CreateRarComponent implements OnInit {

  @Input() itemForm!: FormGroup;
  textToRead: string = "item data";
  monsters!: Monster[];

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private monsterService: MonsterService //TODO REFACTOR-> MOVE TO COMMON
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initForm();
  }

  initData() {
    this.monsterService.getAllMonsters()
      .subscribe(m => this.monsters = m);
  }

  initForm() {
    this.itemForm = this.formBuilder.group({
      id: [],
      name: [],
      droppingMonsters: [],
      type: [],
      family: [],
      weight: [],
      rank: [],
      capacity: [],
      value: [],

      requiredLevel: [],
      requiredStrength: [],
      requiredDexterity: [],
      requiredPower: [],
      requiredKnowledge: [],
      damage: [],
      damageType: [],

      strength: [],
      dexterity: [],
      power: [],
      knowledge: [],
      health: [],
      mana: [],
      stamina: [],

      armorSlashing: [],
      armorCrushing: [],
      armorPiercing: [],
      mentalResistance: [],
      fireResistance: [],
      energyResistance: [],
      coldResistance: []
    })
  }

  save() {
    this.inventoryService.createItem(this.itemForm.value as LegendaryItem)
      .subscribe(() => {
        console.log("SAVED")
      })
  }

  read() {
    let droppingMonsters = this.itemForm.controls['droppingMonsters'].value;
    this.itemForm.reset();
    this.itemForm.controls['droppingMonsters'].setValue(droppingMonsters);
    let strings = this.textToRead.split("\n");
    for (let s of strings) {
      let typeData = s.split(":");
      let key = typeData[0].replace(" ", "_").toUpperCase();
      let value = typeData[1].replace(/^\s+|\+/g, '');
      this.insertToForm(key, value);
    }
  }

  insertToForm(key: string, value: string) {
    switch (key) {
      case "TYP": {
        this.itemForm.controls['type'].setValue(ItemType[value.replace("_", " ") as keyof typeof ItemType]);
        break;
      }
      case "WAGA": {
        this.itemForm.controls['weight'].setValue(value);
        break;
      }
      case "RANGA": {
        this.itemForm.controls['rank'].setValue(this.convertRomanNumberToArabian(value));
        break;
      }
      case "POJEMNOŚĆ": {
        this.itemForm.controls['capacity'].setValue(value);
        break;
      }
      case "WARTOŚĆ": {
        this.itemForm.controls['value'].setValue(value.replace("złota", "").replaceAll(" ", ""));
        break;
      }
      case "WYMAGANY_POZIOM": {
        this.itemForm.controls['requiredLevel'].setValue(value);
        break;
      }
      case "WYMAGANA_SIŁA": {
        this.itemForm.controls['requiredStrength'].setValue(value);
        break;
      }
      case "WYMAGANA_ZRĘCZNOŚĆ": {
        this.itemForm.controls['requiredDexterity'].setValue(value);
        break;
      }
      case "WYMAGANA_MOC": {
        this.itemForm.controls['requiredPower'].setValue(value);
        break;
      }
      case "WYMAGANA_WIEDZA": {
        this.itemForm.controls['requiredKnowledge'].setValue(value);
        break;
      }
      case "OBRAŻENIA": {
        this.itemForm.controls['damage'].setValue(value);
        break;
      }
      case "RODZAJ_OBRAŻEŃ": {
        this.itemForm.controls['damageType'].setValue(DamageType[value as keyof typeof DamageType]);
        break;
      }
      case "SIŁA": {
        this.itemForm.controls['strength'].setValue(value);
        break;
      }
      case "ZRĘCZNOŚĆ": {
        this.itemForm.controls['dexterity'].setValue(value);
        break;
      }
      case "MOC": {
        this.itemForm.controls['power'].setValue(value);
        break;
      }
      case "WIEDZA": {
        this.itemForm.controls['knowledge'].setValue(value);
        break;
      }
      case "PŻ": {
        this.itemForm.controls['health'].setValue(value);
        break;
      }
      case "MANA": {
        this.itemForm.controls['mana'].setValue(value);
        break;
      }
      case "KONDYCJA": {
        this.itemForm.controls['stamina'].setValue(value);
        break;
      }
      case "PANCERZ_SIECZNE": {
        this.itemForm.controls['armorSlashing'].setValue(value);
        break;
      }
      case "PANCERZ_OBUCHOWE": {
        this.itemForm.controls['armorCrushing'].setValue(value);
        break;
      }
      case "PANCERZ_KŁUTE": {
        this.itemForm.controls['armorPiercing'].setValue(value);
        break;
      }
      case "ODPORNOŚĆ_UROKI": {
        this.itemForm.controls['mentalResistance'].setValue(value);
        break;
      }
      case "ODPORNOŚĆ_OGIEŃ": {
        this.itemForm.controls['fireResistance'].setValue(value);
        break;
      }
      case "ODPORNOŚĆ_ENERGIA": {
        this.itemForm.controls['energyResistance'].setValue(value);
        break;
      }
      case "ODPORNOŚĆ_ZIMNO": {
        this.itemForm.controls['coldResistance'].setValue(value);
        break;
      }
    }
  }

  convertRomanNumberToArabian(romanNumber: string) {
    switch (romanNumber) {
      case "I": return 1;
      case "II": return 2;
      case "III": return 3;
      case "IV": return 4;
      case "V": return 5;
      case "VI": return 6;
      case "VII": return 7;
      case "VIII": return 8;
      case "IX": return 9;
      case "X": return 10;
      case "XI": return 11;
      case "XII": return 12;
      default: return 0;
    }
  }

  getItemTypeKeyArray(enumer: any) {
    let keys: string[] = [];
    for (let key in enumer) {
      if (!this.isUpperCase(key)) {
        keys.push(key);
      }
    }
    return keys;
  }

  getItemFamilyKeyArray(enumer: any) {
    let keys: string[] = [];
    for (let key in enumer) {
      if (isNaN(Number(key))) {
        keys.push(key);
      }
    }
    return keys;
  }

  isUpperCase(s: string): boolean {
    return s !== s.toUpperCase();
  }

  protected readonly ItemType = ItemType;
  protected readonly DamageType = DamageType;
  protected readonly ItemFamily = ItemFamily;
}

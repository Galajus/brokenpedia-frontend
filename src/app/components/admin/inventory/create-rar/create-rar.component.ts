import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {InventoryService} from "@services/admin/inventory/inventory.service";
import {MonsterService} from "@services/admin/monsters/monster.service";
import {Monster} from "@models/gameentites/monster";
import {LegendaryItem} from "@models/items/legendaryItem";
import {ItemType} from "@models/items/itemType";
import {DamageType} from "@models/items/damageType";
import {ItemFamily} from "@models/items/itemFamily";
import {SetService} from "@services/admin/set/set.service";
import {ItemSet} from "@models/set/itemSet";

@Component({
    selector: 'app-create-rar',
    templateUrl: './create-rar.component.html',
    styleUrls: ['./create-rar.component.scss'],
    standalone: false
})
export class CreateRarComponent implements OnInit {

  @Input() itemForm!: FormGroup;
  textToRead: string = "item data";
  monsters!: Monster[];
  sets!: ItemSet[];

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private setService: SetService,
    private monsterService: MonsterService //TODO REFACTOR-> MOVE TO COMMON
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initForm();
  }

  initData() {
    this.monsterService.getAllMonsters()
      .subscribe(m => this.monsters = m);
    this.setService.getAllSets()
      .subscribe(s => this.sets = s);
  }

  initForm() {
    this.itemForm = this.formBuilder.group({
      id: [],
      name: [],
      droppingMonsters: [],
      type: [],
      family: [],
      itemSet: [],
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

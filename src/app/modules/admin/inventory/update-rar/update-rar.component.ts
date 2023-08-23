import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LegendaryItem} from "../../../../common/model/items/legendaryItem";
import {InventoryService} from "../inventory.service";
import {ActivatedRoute} from "@angular/router";
import {Monster} from "../../../../common/model/gameentites/monster";
import {MonsterService} from "../../monster/monster.service";
import {ItemType} from "../../../../common/model/items/itemType";
import {DamageType} from "../../../../common/model/items/damageType";

@Component({
  selector: 'app-update-rar',
  templateUrl: './update-rar.component.html',
  styleUrls: ['./update-rar.component.scss']
})
export class UpdateRarComponent implements OnInit {

  @Input() itemForm!: FormGroup;
  monsters!: Monster[];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private monsterService: MonsterService //TODO TO COMMON IN FUTURE
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
    });

    let id = Number(this.route.snapshot.params['id']);
    this.inventoryService.getItem(id)
      .subscribe((item) => {
        this.mapItem(item);
      })
  }

  mapItem(item: LegendaryItem) {
    this.itemForm.patchValue(item);
    console.log(this.itemForm.value)
    //this.itemForm.get('droppingMonsters')?.patchValue()
  }

  save() {
    this.inventoryService.updateItem(this.itemForm.value)
      .subscribe(() => {
        console.log("UPDATED")
      });
  }

  compareWith(monster1: any, monster2: any): boolean {
    return monster1 && monster2 && monster1.id === monster2.id;
  }

  willBeChecked(monster: Monster) {
    const control = this.itemForm.get('droppingMonsters');
    if (!control) {
      return false;
    }
    let monsters = control.value as Array<Monster>;
    let find = monsters.find(m => m.id === monster.id);

    return !!find;
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

  isUpperCase(s: string): boolean {
    return s !== s.toUpperCase();
  }

  protected readonly ItemType = ItemType;
  protected readonly DamageType = DamageType;
}

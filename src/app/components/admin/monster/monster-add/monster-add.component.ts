import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MonsterService} from "@services/admin/monsters/monster.service";
import {MonsterType} from "@models/gameentites/monsterType";
import {Monster} from "@models/gameentites/monster";

@Component({
    selector: 'app-monster-add',
    templateUrl: './monster-add.component.html',
    styleUrls: ['./monster-add.component.scss'],
    standalone: false
})
export class MonsterAddComponent implements OnInit {

  @Input() monsterForm!: FormGroup;
  monsterTypes!: MonsterType[];
  constructor(
    private formBuilder: FormBuilder,
    private monsterService: MonsterService
  ) { }

  ngOnInit(): void {
    this.initData();
    this.initForm();
  }

  initData() {
    this.monsterService.getMonsterTypes()
      .subscribe((types) => this.monsterTypes = types);
  }

  initForm() {
    this.monsterForm = this.formBuilder.group({
      id: [],
      name: [],
      type: [],
      level: []
    })
  }

  save() {
    this.monsterService.createMonster(this.monsterForm.value as Monster)
      .subscribe(() => {
        console.log("SAVED");
      })
  }

}

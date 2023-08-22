import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MonsterType} from "../../../../common/model/gameentites/monsterType";
import {MonsterService} from "../monster.service";
import {Monster} from "../../../../common/model/gameentites/monster";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-monster-update',
  templateUrl: './monster-update.component.html',
  styleUrls: ['./monster-update.component.scss']
})
export class MonsterUpdateComponent implements OnInit {

  @Input() monsterForm!: FormGroup;
  monsterTypes!: MonsterType[];
  constructor(
    private route: ActivatedRoute,
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
      type: []
    })
    let id = Number(this.route.snapshot.params['id']);
    this.monsterService.getMonster(id)
      .subscribe((monster) => {
        this.mapMonster(monster);
      })
  }

  mapMonster(item: Monster) {
    this.monsterForm.patchValue(item);
  }

  save() {
    this.monsterService.createMonster(this.monsterForm.value as Monster)
      .subscribe(() => {
        console.log("SAVED");
      })
  }

}

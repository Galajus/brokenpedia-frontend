import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {SkillsService} from "@services/admin/skills/skills.service";
import {SetService} from "@services/admin/set/set.service";
import {ItemSet, SetCustomEffect, SetPsychoEffect} from "@models/set/itemSet";

@Component({
  selector: 'app-sets-update',
  templateUrl: './sets-update.component.html',
  styleUrls: ['./sets-update.component.scss']
})
export class SetsUpdateComponent implements OnInit {

  @Input() setForm!: FormGroup;
  professions: string[] = [];
  psychoEffects: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private skillsService: SkillsService,
    private setService: SetService
  ) { }

  ngOnInit(): void {
    this.skillsService.getProfessions()
      .subscribe(profs => this.professions = profs);
    this.skillsService.getPsychoEffects()
      .subscribe(eff => this.psychoEffects = eff);

    this.setForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      requiredClass: [null, [Validators.required]],
      psychoEffects: this.formBuilder.array([]),
      customEffects: this.formBuilder.array([])
    });
    let id = Number(this.route.snapshot.params['id']);
    this.setService.getSetById(id)
      .subscribe((set) => {
        this.mapItem(set);
      })
  }

  mapItem(set: ItemSet) {
    this.setForm.patchValue(set);
    set.psychoEffects.forEach(p => {
      this.addPsychoEffect(p);
    });
    set.customEffects.forEach(c => {
      this.addCustomEffect(c);
    });
  }

  addCustomEffect(fromDatabase?: SetCustomEffect) {
    if (fromDatabase) {
      const customEffect = this.formBuilder.group({
        id: [fromDatabase.id],
        effect: [fromDatabase.effect, [Validators.required]],
        value: [fromDatabase.value, [Validators.required]]
      });
      let customEffects = this.setForm.get('customEffects')  as FormArray;
      customEffects.push(customEffect);
      return;
    }
    const customEffect = this.formBuilder.group({
      id: [null],
      effect: [null, [Validators.required]],
      value: [null, [Validators.required]]
    });

    let customEffects = this.setForm.get('customEffects')  as FormArray;
    customEffects.push(customEffect);
  }

  addPsychoEffect(fromDatabase?: SetPsychoEffect) {
    if (fromDatabase) {
      const psychoEffect = this.formBuilder.group({
        id: [fromDatabase.id],
        effect: [fromDatabase.effect, [Validators.required]],
        value: [fromDatabase.value, [Validators.required]]
      });
      let psychoEffects = this.setForm.get('psychoEffects')  as FormArray;
      psychoEffects.push(psychoEffect);
      return;
    }
    const psychoEffect = this.formBuilder.group({
      id: [null],
      effect: [null, [Validators.required]],
      value: [null, [Validators.required]]
    });

    let psychoEffects = this.setForm.get('psychoEffects')  as FormArray;
    psychoEffects.push(psychoEffect);
  }

  getFriendlyPsychoEffects(): FormArray{
    return  this.setForm.get('psychoEffects') as FormArray;
  }

  getFriendlyCustomEffects(): FormArray{
    return this.setForm.get('customEffects') as FormArray;
  }

  save() {
    if (this.setForm.invalid) {
      throw new Error("Wypełnij wszystkie wymagane pola!")
    }

    this.setService.createSet(this.setForm.value)
      .subscribe(s => {
        console.log(s);
        console.log("SAVED");
      })
  }

}

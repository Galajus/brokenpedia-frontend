import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SkillsService} from "@services/admin/skills/skills.service";
import {SetService} from "@services/admin/set/set.service";

@Component({
  selector: 'app-sets-create',
  templateUrl: './sets-create.component.html',
  styleUrls: ['./sets-create.component.scss']
})
export class SetsCreateComponent implements OnInit {

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

  }

  addCustomEffect() {
    const customEffect = this.formBuilder.group({
      id: [null],
      effect: [null, [Validators.required]],
      value: [null, [Validators.required]]
    });

    let customEffects = this.setForm.get('customEffects')  as FormArray;
    customEffects.push(customEffect);
  }

  addPsychoEffect() {
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

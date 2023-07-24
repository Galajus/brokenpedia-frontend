import {Component, Input, OnInit} from '@angular/core';
import {Skill} from "../../../user/build-calculator/model/skill";
import {ActivatedRoute} from "@angular/router";
import {SkillsService} from "../skills.service";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SkillBasic} from "../../../user/build-calculator/model/skillBasic";
import {SkillPsychoEffect} from "../../../user/build-calculator/model/skillPsychoEffect";
import {SkillCustomEffect} from "../../../user/build-calculator/model/skillCustomEffect";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-skill-update',
  templateUrl: './skill-update.component.html',
  styleUrls: ['./skill-update.component.scss']
})
export class SkillUpdateComponent implements OnInit {

  @Input() skillForm!: FormGroup;
  skill: Skill | undefined;
  professions: string[] = [];
  psychoEffects: string[] = [];
  difficulties: string[] = [];
  constructor(
    private router: ActivatedRoute,
    private skillsService: SkillsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getSkill();
    this.skillsService.getProfessions()
      .subscribe(profs => this.professions = profs);
    this.skillsService.getDifficulties()
      .subscribe(dif => this.difficulties = dif);
    this.skillsService.getPsychoEffects()
      .subscribe(eff => this.psychoEffects = eff);

    this.skillForm = this.formBuilder.group({
      id: [null],
      name: [null],
      requirements: [null],
      formula: [null],
      level: [null],
      beginLevel: [null],
      minLevel: [null],
      maxLevel: [null],
      image: [null],
      profession: [null],
      skillBasics: this.formBuilder.array([])
    })
  }

  getSkill() {
    let id = Number(this.router.snapshot.params['id']);
    this.skillsService.getSkill(id)
      .subscribe(skill => {
        this.skill = skill;
        this.mapFormValues(skill);
      });
  }

  private mapFormValues(skill: Skill) {
    this.skillForm.patchValue({
      id: skill.id,
      name: skill.name,
      requirements: skill.requirements,
      formula: skill.formula,
      level: skill.level,
      beginLevel: skill.beginLevel,
      minLevel: skill.minLevel,
      maxLevel: skill.maxLevel,
      image: skill.image,
      profession: skill.profession,
    });
    skill.skillBasics.sort((a, b) => a.skillLevel - b.skillLevel);
    skill.skillBasics.forEach(basic => this.addBasic(basic));
  }

  addBasic(basic: SkillBasic | null) {
    if (basic) {
      const skillBasic = this.formBuilder.group({
        id: basic.id,
        classSkillId: basic.classSkillId,
        skillLevel: basic.skillLevel,
        damage: basic.damage,
        hitChance: basic.hitChance,
        manaCost: basic.manaCost,
        staminaCost: basic.staminaCost,
        roundsTime: basic.roundsTime,
        effectRoundsTime: basic.effectRoundsTime,
        additionalEffectChance: basic.additionalEffectChance,
        specialEffectDescription: basic.specialEffectDescription,
        specialEffectValue: basic.specialEffectValue,
        skillDifficulty: basic.skillDifficulty,
        skillPsychoEffects: this.formBuilder.array([]),
        skillCustomEffects: this.formBuilder.array([])
      });
      basic.skillPsychoEffects.forEach(effect => this.addPsychoEffect(skillBasic, effect));
      basic.skillCustomEffects.forEach(effect => this.addCustomEffect(skillBasic, effect));
      this.basics.push(skillBasic);
      return;
    }

    const skillBasic = this.formBuilder.group({
      id: [''],
      classSkillId: this.skill?.id,
      skillLevel: [null],
      damage: [null],
      hitChance: [null],
      manaCost: [null],
      staminaCost: [null],
      roundsTime: [null],
      effectRoundsTime:[null],
      additionalEffectChance: [null],
      specialEffectDescription: [null],
      specialEffectValue: [null],
      skillDifficulty: [null],
      skillPsychoEffects: this.formBuilder.array([]),
      skillCustomEffects: this.formBuilder.array([])
    });
    this.skillsService.addSkillBasic(skillBasic.value)
      .subscribe(newBasic => {
        skillBasic.patchValue({
          id: newBasic.id.toString()
        })
        this.basics.push(skillBasic);
      })

  }

  removePsychoEffect(id: number) {
    let skillBasics = this.skillForm.get('skillBasics') as FormArray;
    let ids: number[] = [];
    skillBasics.controls.forEach(c => {
      let skillPsychoEffects = c.get('skillPsychoEffects') as FormArray;
      let skillPsychoEffectId = skillPsychoEffects.at(id)?.get('id')?.value;
      if (skillPsychoEffectId) {
        ids.push(skillPsychoEffectId);
      }
      skillPsychoEffects.removeAt(id);
    });
    if (ids.length > 0) {
      this.skillsService.deletePsychoEffects(ids)
        .subscribe();
    }
  }

  removeCustomEffect(id: number) {
    let skillBasics = this.skillForm.get('skillBasics') as FormArray;
    let ids: number[] = [];
    skillBasics.controls.forEach(c => {
      let skillCustomEffects = c.get('skillCustomEffects') as FormArray;
      let skillCustomEffectId = skillCustomEffects.at(id)?.get('id')?.value;
      if (skillCustomEffectId) {
        ids.push(skillCustomEffectId);
      }
      skillCustomEffects.removeAt(id);
    });
    if (ids.length > 0) {
      this.skillsService.deleteCustomEffects(ids)
        .subscribe();
    }
  }

  addPsychoEffect(basicForm: FormGroup, psycho: SkillPsychoEffect | null, basicId?: number) {
    if (!psycho) {
      let skillBasics = this.skillForm.get('skillBasics') as FormArray;
      skillBasics.controls.forEach(c => {
        let skillPsychoEffects = c.get('skillPsychoEffects') as FormArray; //todo null check for changing all null effects

        const psychoEffect = this.formBuilder.group({
          id: [null],
          psychoEffect: [null, [Validators.required]],
          value: [null, [Validators.required]],
          skillBasicId: c.value.id
        });
        skillPsychoEffects.push(psychoEffect);
      })
      return;
    }
    const psychoEffect = this.formBuilder.group({
      id: psycho.id,
      psychoEffect: [psycho.psychoEffect, [Validators.required]],
      value: [psycho.value, [Validators.required]],
      skillBasicId: psycho.skillBasicId
    });
    this.getPsychoEffects(basicForm).push(psychoEffect);
  }

  addCustomEffect(basicForm: FormGroup, custom: SkillCustomEffect | null, basicId?: number) {
    if (!custom) {
      let skillBasics = this.skillForm.get('skillBasics') as FormArray;
      skillBasics.controls.forEach(c => {
        let skillCustomEffects = c.get('skillCustomEffects') as FormArray;
        const customEffect = this.formBuilder.group({
          id: [null],
          description: [null, [Validators.required]],
          value: [null, [Validators.required]],
          skillBasicId: c.value.id
        });
        skillCustomEffects.push(customEffect);
      })

      return;
    }
    const customEffect = this.formBuilder.group({
      id: custom.id,
      description: [custom.description, [Validators.required]],
      value: [custom.value, [Validators.required]],
      skillBasicId: custom.skillBasicId
    });
    this.getCustomEffects(basicForm).push(customEffect);
  }

  getPsychoEffects(basicForm: FormGroup): FormArray {
    return basicForm.controls['skillPsychoEffects'] as FormArray;
  }

  getCustomEffects(basicForm: FormGroup): FormArray {
    return basicForm.controls['skillCustomEffects'] as FormArray;
  }

  get basics() {
    return this.skillForm.controls['skillBasics'] as FormArray;
  }

  getFriendlySkillBasic(index: number): FormGroup{
    let skillBasics = this.skillForm.get('skillBasics') as FormArray;
    return skillBasics.at(index) as FormGroup;
  }

  getFriendlyPsychoEffects(index: number): FormArray {
    let skillBasics = this.skillForm.get('skillBasics') as FormArray;
    return skillBasics.controls.at(index)?.get('skillPsychoEffects') as FormArray;
  }

  getFriendlyCustomEffects(index: number): FormArray {
    let skillBasics = this.skillForm.get('skillBasics') as FormArray;
    return skillBasics.controls.at(index)?.get('skillCustomEffects') as FormArray;
  }

  save() {
    if (this.skillForm.invalid) {
      this.snackBar.open('Wypełnij wszystkie wymagane pola!');
      return;
    }
    this.skillsService.saveSkill(this.skillForm.value)
      .subscribe(response => {
        this.skillForm.markAsUntouched({onlySelf: true});
        this.skillForm.markAsPristine({onlySelf: true});
      })

    let skillBasics = this.skillForm.get('skillBasics') as FormArray;
    skillBasics.controls.forEach(b => this.saveBasic(b));
  }

  saveBasic(basicForm: AbstractControl<any>) {
    if (basicForm.invalid) {
      this.snackBar.open('Wypełnij wszystkie wymagane pola!');
      return;
    }

    if (basicForm.pristine) {
      return;
    }

    this.skillsService.saveSkillBasic(basicForm.value)
      .subscribe(basic => {
        basicForm.markAsPristine();
        basicForm.patchValue(basic);
      })
  }

  deleteBasic(form: AbstractControl<any>, index: number) {
    if (form.value.skillCustomEffects.length == 0 && form.value.skillPsychoEffects.length == 0) {
      this.skillsService.removeSkillBasic(form.value.id).subscribe();
      this.basics.removeAt(index);
      return;
    }

    this.snackBar.open('Najpierw usuń wszystkie custom i psycho efekty');
  }

  fillNewPsychoEffect(value: any) {
    let skillBasics = this.skillForm.get('skillBasics') as FormArray;
    skillBasics.controls.forEach(c => {
      let skillPsychoEffects = c.get('skillPsychoEffects') as FormArray;
      let effectsList = skillPsychoEffects.value as SkillPsychoEffect[];
      effectsList.forEach(choice => {
        if (!choice.psychoEffect) {
          choice.psychoEffect = value;
        }
      })
    })
  }

  fillNewCustomEffect(value: any) {
    let skillBasics = this.skillForm.get('skillBasics') as FormArray;
    skillBasics.controls.forEach(c => {
      let skillCustomEffects = c.get('skillCustomEffects') as FormArray;
      let effectsList = skillCustomEffects.value as SkillCustomEffect[];
      effectsList.forEach(choice => {
        if (!choice.description) {
          choice.description = value;
        }
      })
      skillCustomEffects.patchValue(effectsList);
    })
  }
}

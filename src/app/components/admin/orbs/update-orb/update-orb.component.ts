import {Component, Input, OnInit} from '@angular/core';
import {OrbType} from "@models/orb/orbType";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OrbsService} from "@services/admin/orbs/orbs.service";
import {Orb} from "@models/orb/orb";

@Component({
  selector: 'app-update-orb',
  templateUrl: './update-orb.component.html',
  styleUrls: ['./update-orb.component.scss']
})
export class UpdateOrbComponent implements OnInit {

  protected readonly OrbType = OrbType;
  @Input() orbForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private orbsService: OrbsService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.orbForm = this.formBuilder.group({
      id: [],
      effect: [],
      type: [],
      startBonus: [],
      shortName: []
    })
    const id = Number(this.route.snapshot.params['id']);
    this.orbsService.getOrb(id)
      .subscribe((orb) => {
        this.orbForm.patchValue(orb);
      })
  }

  save() {
    this.orbsService.updateOrb(this.orbForm.value as Orb)
      .subscribe(() => {
        console.log("SAVED");
      })
  }
}

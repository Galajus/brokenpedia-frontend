import {Component, Input, OnInit} from '@angular/core';
import {OrbType} from "@models/orb/orbType";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OrbsService} from "@services/admin/orbs/orbs.service";
import {Orb} from "@models/orb/orb";
import {Drif} from "@models/drif/drif";

@Component({
    selector: 'app-update-orb',
    templateUrl: './update-orb.component.html',
    styleUrls: ['./update-orb.component.scss'],
    standalone: false
})
export class UpdateOrbComponent implements OnInit {

  protected readonly OrbType = OrbType;
  @Input() orbForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    if (id === 0) {
      return;
    }
    this.orbsService.getOrb(id)
      .subscribe((orb) => {
        this.orbForm.patchValue(orb);
      })
  }

  save() {
    const id = Number(this.route.snapshot.params['id']);

    if (id === 0) {
      this.orbsService.createOrb(this.orbForm.value as Orb)
        .subscribe((o) => {
          console.log("CREATED");
          this.router.navigate(["/admin/orbs/update/" + o.id]);
          this.orbForm.patchValue(o);
        })
      return;
    }
    this.orbsService.updateOrb(this.orbForm.value as Orb)
      .subscribe(() => {
        console.log("SAVED");
      })
  }
}

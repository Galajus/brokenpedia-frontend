import {Component, Input, OnInit} from '@angular/core';
import {DrifCategory} from "@models/drif/drifCategory";
import {PsychoMod} from "@models/items/psychoMod";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DrifsService} from "@services/admin/drifs/drifs.service";
import {Drif} from "@models/drif/drif";

@Component({
    selector: 'app-update-drif',
    templateUrl: './update-drif.component.html',
    styleUrls: ['./update-drif.component.scss'],
    standalone: false
})
export class UpdateDrifComponent implements OnInit {

  protected readonly DrifCategory = DrifCategory;
  protected readonly PsychoMod = PsychoMod;
  @Input() drifForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private drifsService: DrifsService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.drifForm = this.formBuilder.group({
      id: [],
      shortName: [],
      startPower: [],
      psychoGrowByLevel: [],
      category: [],
      psychoMod: [],
      forRemoval: []
    });
    const id = Number(this.route.snapshot.params['id']);
    this.drifsService.getDrif(id)
      .subscribe(drif => {
        this.drifForm.patchValue(drif);
      })
  }

  save() {
    const id = Number(this.route.snapshot.params['id']);
    console.log(id);

    if (id === 0) {
      this.drifsService.createDrif(this.drifForm.value as Drif)
        .subscribe((d) => {
          console.log("CREATED");
          this.router.navigate(["/admin/drifs/update/" + d.id]);
          this.drifForm.patchValue(d);
        })
      return;
    }
    this.drifsService.updateDrif(this.drifForm.value as Drif)
      .subscribe(() => {
        console.log("SAVED");
      })
  }
}

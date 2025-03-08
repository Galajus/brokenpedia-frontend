import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DrifSelectComponent} from "@app/components/user/drif-simulator/drif-select/drif-select.component";


@Component({
  selector: 'app-create-build-dialog',
  templateUrl: './create-build-dialog.component.html',
  styleUrl: './create-build-dialog.component.scss',
  standalone: false,
})
export class CreateBuildDialogComponent implements OnInit {

  buildName: string = "";

  constructor(
    private dialogRef: MatDialogRef<DrifSelectComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data && data.name) {
      this.buildName = data.name;
    }
  }

  ngOnInit(): void {
  }

  create(): void {
    this.dialogRef.close({buildName: this.buildName});
  }

  close(): void {
    this.dialogRef.close();
  }

}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-edit-admin-comment',
    templateUrl: './edit-admin-comment.component.html',
    styleUrls: ['./edit-admin-comment.component.scss'],
    standalone: false
})
export class EditAdminCommentComponent implements OnInit {
  comment: string = "";

  constructor(
    private dialogRef: MatDialogRef<EditAdminCommentComponent>,
              @Inject(MAT_DIALOG_DATA) data: any) {
    this.comment = data.comment;
  }

  ngOnInit(): void {
    this.dialogRef.backdropClick()
      .subscribe(e => {
        this.dialogRef.close({comment: this.comment});
      });
  }

}

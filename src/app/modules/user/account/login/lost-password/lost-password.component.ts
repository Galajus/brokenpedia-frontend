import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginService} from "../login.service";

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.scss']
})
export class LostPasswordComponent implements OnInit {
  formGroup!: FormGroup;
  formError = "";
  formGroupChangePassword!: FormGroup;
  formChangePasswordError = "";
  hash = "";
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.required]
    });
    this.formGroupChangePassword = this.formBuilder.group({
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    });

    this.hash = this.route.snapshot.params['hash'];
  }

  send() {
    if (this.formGroup.valid) {
      this.loginService.lostPassword(this.formGroup.value)
        .subscribe({
          next: result => {
            this.formError = "";
            this.formGroup.reset();
            this.snackBar.open('Email z linkiem został wysłany', '', {
              duration: 3000, panelClass: "snack-bar-bg-color-ok"
            });
          },
          error: error => this.formError = "Coś poszło nie tak"
        });
    }
  }

  sendChangePassword() {
    if (this.formGroupChangePassword.valid && this.passwordIdentical(this.formGroupChangePassword.value)) {
      if(!this.validatePassword(this.formGroupChangePassword.value.password)) {
        this.formChangePasswordError = "Hasło musi mieć conajmniej 8 znaków, jedną małą i dużą literę oraz cyfrę";
        return;
      }

      this.loginService.changePassword({
        password: this.formGroupChangePassword.get("password")?.value,
        repeatPassword: this.formGroupChangePassword.get("repeatPassword")?.value,
        hash: this.hash
      })
        .subscribe({
          next: () => {
            this.formChangePasswordError = ""
            this.formGroupChangePassword.reset();
            this.snackBar.open('Hasło zostało zmienione', '', {
              duration: 3000, panelClass: "snack-bar-bg-color-ok" });
          },
          error: error => this.formChangePasswordError = "Link ze zmianą hasła prawdopodobnie się przedawnił"
        });
    }
  }

  private passwordIdentical(changePassword: any) {
    if (changePassword.password === changePassword.repeatPassword) {
      this.formChangePasswordError = "";
      return true;
    }
    this.formChangePasswordError = "Hasła nie są identyczne";
    return false;
  }

  validatePassword(password: string): boolean {
    let passwordRegExp = /^(?=.*\d)(?=.*[a-zżźćńółęąś])(?=.*[A-ZŻŹĆĄŚĘŁÓŃ]).{8,}$/;
    return passwordRegExp.test(password);
  }

}

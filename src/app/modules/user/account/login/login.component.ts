import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtService} from "../../../../common/service/jwt.service";
import {LoginService} from "./login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private readonly REDIRECT_ROUTE = "/acc/dashboard";
  loginForm!: FormGroup;
  loginError = false;
  loginErrorMessage = "";
  registerForm!: FormGroup;
  registerError = false;
  registerErrorMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.jwtService.isLoggedIn()) {
      this.router.navigate([this.REDIRECT_ROUTE]);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    })
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginErrorMessage = "Formularz został wypełniony niewłaściwie";
      this.loginError = true;
      return;
    }
    this.loginService.login(this.loginForm.value)
      .subscribe({
        next: (response) => {
          this.jwtService.setToken(response.token);
          this.loginError = false;
          this.router.navigate([this.REDIRECT_ROUTE]);
        },
        error: err => {
          this.loginError = true;
        }
      });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerErrorMessage = "Formularz został wypełniony niewłaściwie";
      this.registerError = true;
      return;
    }
    if (this.isPasswordNotIdentical(this.registerForm.value)) {
      this.registerErrorMessage = "Podane hasła nie są identyczne";
      this.registerError = true;
      return;
    }
    this.loginService.register(this.registerForm.value)
      .subscribe({
          next: (response) => {
            this.jwtService.setToken(response.token);
            this.router.navigate([this.REDIRECT_ROUTE]);
          },
          error: (err) => {
            this.registerError = true;
            if (err.error.message) {
              this.registerErrorMessage = err.error.message;
            } else {
              this.registerErrorMessage = "Coś poszło nie tak, spróbuj ponownie później";
            }
          }
        }
      );
  }

  private isPasswordNotIdentical(register: any): boolean {
    return !register.password === register.repeatPassword;
  }

}

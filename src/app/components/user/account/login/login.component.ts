import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtService} from "@services/jwt/jwt.service";
import {LoginService} from "@services/user/account/login.service";
import {LoginButtonService} from "@services/layout/login-button.service";

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
  registerSuccess = false;
  registerSuccessMessage = "Link z potwierdzeniem konta został wysłany!"

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private jwtService: JwtService,
    private loginButtonService: LoginButtonService,
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
      repeatPassword: ['', Validators.required],
      nickname: ['', Validators.required]
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
          this.loginButtonService.loggedIn(true);
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
    if (!this.isPasswordIdentical(this.registerForm.value)) {
      this.registerErrorMessage = "Podane hasła nie są identyczne";
      this.registerError = true;
      return;
    }

    if(!this.validatePassword(this.registerForm.value.password)) {
      this.registerErrorMessage = "Hasło musi mieć conajmniej 8 znaków, jedną małą i dużą literę oraz cyfrę";
      this.registerError = true;
      return;
    }

    if (!this.validateNickname(this.registerForm.value.nickname)) {
      this.registerErrorMessage = "Nick musi mieć od 5 do 18 znaków, zaczynać się od litery oraz nie może zawierać znaków specjalnych";
      this.registerError = true;
      return;
    }

    this.loginService.register(this.registerForm.value)
      .subscribe({
          next: (response) => {
            if (response.confirmed) {
              this.registerSuccess = true;
              this.registerError = false;
              this.registerForm.reset();
            } else {
              this.registerError = true;
              this.registerSuccess = false;
              this.registerErrorMessage = "Prawdopodobnie mail jest już zajęty";
            }
          },
          error: (err) => {
            this.registerError = true;
            this.registerSuccess = false;
            this.registerErrorMessage = "Coś poszło nie tak, spróbuj ponownie później";
          }
        }
      );
  }

  private isPasswordIdentical(register: any): boolean {
    return register.password === register.repeatPassword;
  }

  validatePassword(password: string): boolean {
    let passwordRegExp = /^(?=.*\d)(?=.*[a-zżźćńółęąś])(?=.*[A-ZŻŹĆĄŚĘŁÓŃ]).{8,}$/;
    return passwordRegExp.test(password);
  }

  validateNickname(nickname: string): boolean {
    let nicknameReqExp = /^[a-zA-Z]\w*$/;
    if (nickname.length < 5) {
      return false;
    }
    if (nickname.length > 18) {
      return false;
    }
    return nicknameReqExp.test(nickname);
  }

}

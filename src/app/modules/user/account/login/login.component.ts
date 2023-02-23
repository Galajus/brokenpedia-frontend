import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private readonly REDIRECT_ROUTE = "/profile";
  loginForm!: FormGroup;
  loginError = false;
  loginErrorMessage = "";
  registerForm!: FormGroup;
  registerError = false;
  registerErrorMessage = "";

  constructor() { }

  ngOnInit(): void {
  }

}

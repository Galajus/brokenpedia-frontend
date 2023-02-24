import {Component, OnInit} from '@angular/core';
import {JwtService} from "../../../../common/service/jwt.service";
import {Router} from "@angular/router";
import {LoginButtonService} from "../../../../common/service/login-button.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private jwtService: JwtService,
    private loginButtonService: LoginButtonService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logOut() {
    this.jwtService.logOut();
    this.loginButtonService.loggedIn(false);
    this.router.navigate(["/"]);
  }

}

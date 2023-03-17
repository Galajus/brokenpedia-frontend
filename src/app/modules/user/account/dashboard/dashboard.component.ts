import {Component, OnInit} from '@angular/core';
import {JwtService} from "../../../../common/service/jwt.service";
import {Router} from "@angular/router";
import {LoginButtonService} from "../../../../common/service/login-button.service";
import {DashboardService} from "./dashboard.service";
import {Profile} from "./model/profile";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private jwtService: JwtService,
    private dashboardService: DashboardService,
    private loginButtonService: LoginButtonService,
    private router: Router
  ) { }

  profile!: Profile;

  ngOnInit(): void {
    let uuid = this.jwtService.getUuid();
    if (uuid == null) {
      return;
    }
    this.dashboardService.getProfile(uuid)
      .subscribe(profile => this.profile = profile);
  }

  logOut() {
    this.jwtService.logOut();
    this.loginButtonService.loggedIn(false);
    this.router.navigate(["/"]);
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtService} from "../../../../common/service/jwt.service";
import {Router} from "@angular/router";
import {LoginButtonService} from "../../../../common/service/login-button.service";
import {DashboardService} from "./dashboard.service";
import {Profile} from "./model/profile";
import {BuildListDto} from "./model/buildListDto";
import {MatTable} from "@angular/material/table";

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
  builds!: Array<BuildListDto>;
  displayedColumns = ["id", "profession", "level", "buildName", "shortDescription", "hidden", "pvpBuild", "actions"];

  ngOnInit(): void {
    let uuid = this.jwtService.getUuid();
    if (uuid == null) {
      return;
    }
    this.dashboardService.getProfile(uuid)
      .subscribe(profile => this.profile = profile);
    this.dashboardService.getBuildsList(uuid)
      .subscribe(builds => this.builds = builds);
  }

  logOut() {
    this.jwtService.logOut();
    this.loginButtonService.loggedIn(false);
    this.router.navigate(["/"]);
  }

  deleteBuild(id: number) {
    this.dashboardService.deleteBuild(id)
      .subscribe(result => {
        this.builds = this.builds.filter(b => {
          return b.id !== id;
        });
      });
  }

  trackBy(index: number, item: BuildListDto) {
    return item.id;
  }
}

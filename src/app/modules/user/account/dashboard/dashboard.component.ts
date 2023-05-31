import {Component, OnInit} from '@angular/core';
import {JwtService} from "../../../../common/service/jwt.service";
import {Router} from "@angular/router";
import {LoginButtonService} from "../../../../common/service/login-button.service";
import {DashboardService} from "./dashboard.service";
import {Profile} from "./model/profile";
import {BuildListDto} from "../../../../common/model/buildListDto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProfileNicknameDto} from "./model/profileNicknameDto";

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
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  profile!: Profile;
  builds!: Array<BuildListDto>;
  displayedColumns = ["id", "profession", "level", "likes", "buildName", "shortDescription", "hidden", "pvpBuild", "actions"];
  isChangingNick: boolean = false;
  newNick: string = "";
  ngOnInit(): void {
    this.dashboardService.getProfile()
      .subscribe(profile => {
        this.profile = profile;
        this.newNick = profile.nickname;
      });
    this.dashboardService.getBuildsList()
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

  changeEditNick() {
    if (this.isChangingNick) {
      this.isChangingNick = false;
      let nickString = this.newNick;
      if (nickString !== this.profile.nickname) {
        let updateNick = {
          nickname: nickString
        } as ProfileNicknameDto;
        this.dashboardService.updateNick(updateNick)
          .subscribe({
            next: value => {
              this.snackBar.open("Nick zaktualizowany", "ok", {duration: 3000});
              this.profile.nickname = nickString;
            }
          })
      }
    } else {
      this.isChangingNick = true;
    }
  }
}

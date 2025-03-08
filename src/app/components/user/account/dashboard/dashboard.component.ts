import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtService} from "@services/jwt/jwt.service";
import {Router} from "@angular/router";
import {LoginButtonService} from "@services/layout/login-button.service";
import {DashboardService} from "@services/user/account/dashboard.service";
import {Profile} from "@models/user/profile";
import {ProfileNicknameDto} from "@models/user/profileNicknameDto";
import {MatSort} from "@angular/material/sort";
import {BuildListDto} from "@models/build-list/buildListDto";
import {PageableBuildsDto} from "@models/build-list/pageableBuildsDto";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginatorLiked') paginatorLiked!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  profile!: Profile;
  builds!: PageableBuildsDto<BuildListDto>;
  likedBuilds!: PageableBuildsDto<BuildListDto>;
  displayedColumns = ["id", "profession", "level", "likes", "buildName", "shortDescription", "hidden", "pvpBuild", "actions"];
  displayedColumnsLiked = ["id", "profession", "level", "likes", "buildName", "shortDescription", "pvpBuild", "actions"];
  isChangingNick: boolean = false;
  page: number = 0;
  pageLiked: number = 0;
  newNick: string = "";

  constructor(
    private jwtService: JwtService,
    private dashboardService: DashboardService,
    private loginButtonService: LoginButtonService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.dashboardService.getProfile()
      .subscribe(profile => {
        this.profile = profile;
        this.newNick = profile.nickname;
      });
    this.loadCreatedBuild();
    this.loadLikedBuild();
  }

  loadCreatedBuild() {
    this.dashboardService.getBuildsList(this.page)
      .subscribe(builds => {
        this.builds = builds;
      });
  }
  loadLikedBuild() {
    this.dashboardService.getLikedBuildsList(this.pageLiked)
      .subscribe(builds => {
        this.likedBuilds = builds;
      });
  }

  logOut() {
    this.jwtService.logOut();
    this.loginButtonService.loggedIn(false);
    this.router.navigate(["/"]);
  }

  deleteBuild(id: number) {
    this.dashboardService.deleteBuild(id)
      .subscribe(result => {
        this.builds.pageableBuilds.content = this.builds.pageableBuilds.content.filter(b => {
          return b.id !== id;
        });
      });
  }

  trackBy(index: number, item: BuildListDto) {
    return item.id;
  }

  onPageEvent(event: PageEvent) {
    this.page = event.pageIndex;
    this.loadCreatedBuild();
  }

  onLikedPageEvent(event: PageEvent) {
    this.pageLiked = event.pageIndex;
    this.loadLikedBuild();
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

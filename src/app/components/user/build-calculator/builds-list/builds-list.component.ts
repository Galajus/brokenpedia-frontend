import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BuildCalculatorService} from "@services/user/build-calculator/build-calculator.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {PaginationType} from "@models/build-list/paginationType";
import {PageableBuildsDto} from "@models/build-list/pageableBuildsDto";
import {JwtService} from "@services/jwt/jwt.service";
import {BuildListDto} from "@models/build-list/buildListDto";

@Component({
  selector: 'app-builds-list',
  templateUrl: './builds-list.component.html',
  styleUrls: ['./builds-list.component.scss']
})
export class BuildsListComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  builds!: PageableBuildsDto<BuildListDto>;
  paginationType: PaginationType = PaginationType.LEVEL;
  displayedColumns = ["lp", "author", "profession", "level", "likes", "buildName", "shortDescription", "pvpBuild", "actions"];
  isAdmin: boolean = false;
  constructor(
    private buildCalculatorService: BuildCalculatorService,
    private jwtService: JwtService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.jwtService.hasAdminAccess();
    this.loadBuildsByLevel(200, 0, 0);
  }

  private loadBuildsByLevel(less: number, greater: number, page: number) {
    this.buildCalculatorService.getBuildsByLevel(less, greater, page)
      .subscribe({
        next: builds => {
          this.builds = builds;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  private loadBuildsByProfession() {
    console.log("TODO")
  }

  private loadBuildByPvp() {
    console.log("TODO")
  }

  onPageEvent(event: PageEvent) {
    switch (this.paginationType) {
      case PaginationType.LEVEL: this.loadBuildsByLevel(200, 0, event.pageIndex);
        break;
      case PaginationType.PROFESSION: this.loadBuildsByProfession();
        break;
      case PaginationType.PVP: this.loadBuildByPvp();
        break;
      default: this.loadBuildsByLevel(200, 0, 0);
        break;
    }
  }

  deleteBuild(id: number) {
    if (!this.isAdmin) {
      return;
    }
    this.buildCalculatorService.deleteBuild(id)
      .subscribe(result => {
        this.builds.pageableBuilds.content = this.builds.pageableBuilds.content.filter(b => {
          return b.id !== id;
        });
      });
  }

  trackBy(index: number, item: BuildListDto) {
    return item.id;
  }

    protected readonly indexedDB = indexedDB;
}

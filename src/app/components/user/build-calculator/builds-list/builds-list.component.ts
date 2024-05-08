import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BuildCalculatorService} from "@services/user/build-calculator/build-calculator.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {PageableBuildsDto} from "@models/build-list/pageableBuildsDto";
import {JwtService} from "@services/jwt/jwt.service";
import {BuildListDto} from "@models/build-list/buildListDto";
import {Profession} from "@models/gameentites/profession";
import {BuildListSortingOption} from "@models/build-list/buildSortingOption";

@Component({
  selector: 'app-builds-list',
  templateUrl: './builds-list.component.html',
  styleUrls: ['./builds-list.component.scss']
})
export class BuildsListComponent implements OnInit {

  protected readonly indexedDB = indexedDB;
  protected readonly Profession = Profession;

  @ViewChild('paginator') paginator!: MatPaginator;
  builds!: PageableBuildsDto<BuildListDto>;
  displayedColumns = ["lp", "author", "profession", "level", "likes", "buildName", "shortDescription", "pvpBuild", "actions"];
  sortingOptions: BuildListSortingOption[] = [
    {id: 0, direction: 'ASC', sortBy: 'LEVEL'},
    {id: 1, direction: 'DESC', sortBy: 'LEVEL'},
    {id: 2, direction: 'ASC', sortBy: 'LIKES'},
    {id: 3, direction: 'DESC', sortBy: 'LIKES'}
  ]
  isAdmin: boolean = false;

  page: number = 0;
  selectedProfs: string[] = [Profession.BARBARIAN, Profession.FIRE_MAGE, Profession.VOODOO, Profession.ARCHER, Profession.SHEED, Profession.KNIGHT, Profession.DRUID];
  isPvp: boolean = false;
  searchMaxLvl: number = 140;
  searchMinLvl: number = 0;
  minLikes: number = 0;
  sortBy: number = 1;

  constructor(
    private buildCalculatorService: BuildCalculatorService,
    private jwtService: JwtService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.isAdmin = this.jwtService.hasAdminAccess();
    this.loadBuilds();
  }

  private loadBuilds() {
    const sort = this.sortingOptions.find(o => o.id === this.sortBy);
    if (!sort) {
      throw new Error("UNKNOWN SORTING OPTION");
    }
    this.buildCalculatorService.getBuildsFiltered(this.searchMaxLvl, this.searchMinLvl, this.isPvp, this.selectedProfs, this.minLikes, sort.sortBy, sort.direction, this.page)
      .subscribe({
        next: builds => {
          this.builds = builds;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  onPageEvent(event: PageEvent) {
    this.page = event.pageIndex;
    this.loadBuilds();
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

  doFilter() {
    this.loadBuilds();
  }

  selectProfession(profession: string) {
    if (this.selectedProfs.includes(profession)) {
      this.selectedProfs = this.selectedProfs.filter(p => p !== profession);
    } else {
      this.selectedProfs.push(profession);
    }
    this.doFilter();
  }
}

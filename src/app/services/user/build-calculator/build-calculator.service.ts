import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {InitBuildCalculator} from "@models/build-calculator/initBuildCalculator";
import {DatabaseBuild} from "@models/build-calculator/databaseBuild";
import {Skill} from "@models/skills/skill";
import {BuildLiker} from "@models/build-calculator/buildLiker";
import {PageableBuildsDto} from "@models/build-list/pageableBuildsDto";
import {IncrustatedLegendaryItem} from "@models/items/incrustatedLegendaryItem";
import {BuildListDto} from "@models/build-list/buildListDto";
import {Drif} from "@models/drif/drif";
import {Orb} from "@models/orb/orb";
import {environment} from "../../../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class BuildCalculatorService {

  subject: Subject<number> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

   getInitData(): Observable<InitBuildCalculator> {
    return this.http.get<InitBuildCalculator>(environment.endpoints.buildCalculator.initData);
  }
  saveSkill(skill: any): Observable<Skill> {
    return this.http.post<Skill>(environment.endpoints.buildCalculator.saveSkill, skill);
  }
  saveBuild(build: DatabaseBuild): Observable<DatabaseBuild> {
    return this.http.post<DatabaseBuild>(environment.endpoints.buildCalculator.saveBuild, build);
  }

  updateBuild(build: DatabaseBuild): Observable<DatabaseBuild> {
    return this.http.put<DatabaseBuild>(environment.endpoints.buildCalculator.updateBuild, build);
  }

  addLiker(liker: BuildLiker):Observable<BuildLiker> {
    return this.http.put<BuildLiker>(environment.endpoints.buildCalculator.addLiker, liker);
  }

  deleteBuild(id: number): Observable<void> {
    return this.http.delete<void>(environment.endpoints.buildCalculator.deleteBuild + id);
  }

  getBuild(id: number): Observable<DatabaseBuild> {
    return this.http.get<DatabaseBuild>(environment.endpoints.buildCalculator.getBuild + id);
  }

  getBuildWithoutAccount(id: number): Observable<DatabaseBuild> {
    return this.http.get<DatabaseBuild>(environment.endpoints.buildCalculator.getBuildWithoutAccount + id);
  }

  getBuildsFiltered(levelLess: number, levelGreater: number, isPvp: boolean, profession: string[], likes: number, sorting: string, sortDirection: string, page: number): Observable<PageableBuildsDto<BuildListDto>> {
    if (!levelLess) {
      levelLess = 140;
    }
    if (!levelGreater) {
      levelGreater = 0;
    }
    if (!likes) {
      likes = 0;
    }

    return this.http.get<PageableBuildsDto<BuildListDto>>(`/api/builds/filtered?levelLess=${levelLess}&levelGreater=${levelGreater}&isPvp=${isPvp}&profession=${profession}&likes=${likes}&sorting=${sorting}&sortDirection=${sortDirection}&page=${page}`);
  }

  showSkillDataBySelectedLevel(level: number) {
    this.subject.next(level);
  }

  getAllLegendaryItems(): Observable<IncrustatedLegendaryItem[]> {
    return this.http.get<IncrustatedLegendaryItem[]>(environment.endpoints.buildCalculator.getLegendaryItems)
  }

  getAllDrifs(): Observable<Drif[]> {
    return this.http.get<Drif[]>(environment.endpoints.buildCalculator.getAllDrifs);
  }

  getAllOrbs(): Observable<Orb[]> {
    return this.http.get<Orb[]>(environment.endpoints.buildCalculator.getAllOrbs);
  }

  getLevelString(lvl: number) {
    let number = Math.floor(lvl / 7);
    number = Math.floor(number);
    if (number == lvl / 7) {
      if (number == 0) {
        return 0;
      }
      return (number) + "-" + 7;
    }
    return (number + 1) + "-" + (lvl - (number * 7));
  }
}

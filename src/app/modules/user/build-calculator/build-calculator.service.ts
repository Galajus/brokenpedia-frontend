import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {InitBuildCalculator} from "./model/initBuildCalculator";
import {DatabaseBuild} from "./model/databaseBuild";
import {Skill} from "./model/skill";
import {BuildLiker} from "./model/buildLiker";
import {BuildListDto} from "../../../common/model/buildListDto";
import {PageableBuildsDto} from "./builds-list/model/pageableBuildsDto";
import {IncrustatedLegendaryItem} from "../rar-list/model/incrustatedLegendaryItem";
import {Drif} from "../../../common/model/drif/drif";
import {Orb} from "../../../common/model/orb/orb";

@Injectable({
  providedIn: 'root'
})
export class BuildCalculatorService {

  subject: Subject<number> = new Subject();

  constructor(
    private http: HttpClient
  ) { }

   getInitData(): Observable<InitBuildCalculator> {
    return this.http.get<InitBuildCalculator>("/api/builds/initData");
  }
  saveSkill(skill: any): Observable<Skill> {
    return this.http.post<Skill>("/api/admin/skills", skill);
  }
  saveBuild(build: DatabaseBuild): Observable<DatabaseBuild> {
    return this.http.post<DatabaseBuild>("/api/profile/builds", build);
  }

  updateBuild(build: DatabaseBuild): Observable<DatabaseBuild> {
    return this.http.put<DatabaseBuild>("/api/profile/builds", build);
  }

  addLiker(liker: BuildLiker):Observable<BuildLiker> {
    return this.http.put<BuildLiker>("/api/profile/builds/add-liker", liker);
  }

  deleteBuild(id: number): Observable<void> {
    return this.http.delete<void>("/api/profile/builds/" + id);
  }

  getBuild(id: number): Observable<DatabaseBuild> {
    return this.http.get<DatabaseBuild>("/api/profile/builds/" + id);
  }

  getBuildWithoutAccount(id: number): Observable<DatabaseBuild> {
    return this.http.get<DatabaseBuild>("/api/builds/" + id);
  }

  getBuildsByLevel(less: number, greater: number, page: number): Observable<PageableBuildsDto<BuildListDto>> {
    return this.http.get<PageableBuildsDto<BuildListDto>>(`/api/builds/by-level?less=${less}&greater=${greater}&page=${page}`);
  }

  getBuildsByPvp(isPvp: boolean): Observable<PageableBuildsDto<BuildListDto>> {
    return this.http.get<PageableBuildsDto<BuildListDto>>(`/api/builds/by-pvp/${isPvp}`);
  }

  getBuildsByProfession(profession: string): Observable<PageableBuildsDto<BuildListDto>> {
    return this.http.get<PageableBuildsDto<BuildListDto>>(`/api/builds/by-profession/${profession}`);
  }

  showSkillDataBySelectedLevel(level: number) {
    this.subject.next(level);
  }

  getAllLegendaryItems(): Observable<IncrustatedLegendaryItem[]> {
    return this.http.get<IncrustatedLegendaryItem[]>("/api/items/legendary")
  }

  getAllDrifs(): Observable<Drif[]> {
    return this.http.get<Drif[]>("/api/drifs");
  }

  getAllOrbs(): Observable<Orb[]> {
    return this.http.get<Orb[]>("/api/orbs");
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

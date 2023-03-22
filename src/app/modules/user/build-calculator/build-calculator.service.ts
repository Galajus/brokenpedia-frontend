import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {InitBuildCalculator} from "./model/initBuildCalculator";
import {DatabaseBuild} from "./model/databaseBuild";
import {Skill} from "./model/skill";
import {BuildLiker} from "./model/buildLiker";

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
    return this.http.post<DatabaseBuild>("/api/profile/builds/save", build);
  }

  addLiker(liker: BuildLiker):Observable<BuildLiker> {
    return this.http.put<BuildLiker>("/api/profile/builds/add-liker", liker);
  }

  getBuild(id: number): Observable<DatabaseBuild> {
    return this.http.get<DatabaseBuild>("/api/profile/builds/" + id);
  }

  getBuildWithoutAccount(id: number): Observable<DatabaseBuild> {
    return this.http.get<DatabaseBuild>("/api/builds/" + id);
  }

  showSkillDataBySelectedLevel(level: number) {
    this.subject.next(level);
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

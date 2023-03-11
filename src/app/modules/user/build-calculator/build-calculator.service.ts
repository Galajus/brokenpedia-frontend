import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Skill} from "./model/skill";
import {InitBuildCalculator} from "./model/initBuildCalculator";

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

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Skill} from "../../../models/skills/skill";
import {SkillBasic} from "../../../models/skills/skillBasic";

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor(private http: HttpClient) { }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>("/api/admin/skills");
  }

  getProfessions(): Observable<Array<string>> {
    return this.http.get<Array<string>>("/api/admin/skills/professions")
  }

  getPsychoEffects(): Observable<Array<string>> {
    return this.http.get<Array<string>>("/api/admin/skills/psycho-effects")
  }

  getDifficulties(): Observable<Array<string>> {
    return this.http.get<Array<string>>("/api/admin/skills/difficulties")
  }

  getSkill(id: number): Observable<Skill> {
    return this.http.get<Skill>("/api/admin/skills/" + id);
  }

  saveSkill(skill: any): Observable<Skill> {
    return this.http.post<Skill>("/api/admin/skills", skill);
  }

  addSkillBasic(basic: any): Observable<SkillBasic> {
    return this.http.put<SkillBasic>("/api/admin/skills/basic", basic);
  }

  saveSkillBasic(basic: any): Observable<SkillBasic> {
    return this.http.post<SkillBasic>("/api/admin/skills/basic", basic);
  }

  removeSkillBasic(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/skills/basic/" + id)
  }

  deleteCustomEffects(ids: number[]): Observable<void> {
    return this.http.delete<void>("/api/admin/skills/custom", {body: ids});
  }

  deletePsychoEffects(ids: number[]): Observable<void> {
    return this.http.delete<void>("/api/admin/skills/psycho", {body: ids});
  }
}

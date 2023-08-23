import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {MonsterType} from "../../../common/model/gameentites/monsterType";
import {Monster} from "../../../common/model/gameentites/monster";

@Injectable({
  providedIn: 'root'
})
export class MonsterService {

  constructor(private http: HttpClient) { }

  getAllMonsters(): Observable<Monster[]> {
    return this.http.get<Monster[]>("/api/admin/monsters");
  }
  getMonster(id: number): Observable<Monster> {
    return this.http.get<Monster>("/api/admin/monsters/" + id);
  }
  createMonster(monster: Monster): Observable<Monster> {
    return this.http.post<Monster>("/api/admin/monsters", monster);
  }
  updateMonster(monster: Monster): Observable<Monster> {
    return this.http.put<Monster>("/api/admin/monsters", monster);
  }
  deleteMonster(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/monsters/" + id);
  }
  getMonsterTypes(): Observable<MonsterType[]> {
    return this.http.get<MonsterType[]>("/api/admin/monsters/types");
  }

}

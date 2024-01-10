import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {MonsterWithIncrustatedLegendaryItems} from "@models/gameentites/monster";

@Injectable({
  providedIn: 'root'
})
export class RarListService {

  constructor(private http: HttpClient) { }

  getAllMonstersWithLegendaryItems(): Observable<MonsterWithIncrustatedLegendaryItems[]> {
    return this.http.get<MonsterWithIncrustatedLegendaryItems[]>("/api/monsters");
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {MonsterWithIncrustatedLegendaryItems} from "@models/gameentites/monster";
import {IncrustatedLegendaryItem} from "@models/items/incrustatedLegendaryItem";
import {ItemSet} from "@models/set/itemSet";

@Injectable({
  providedIn: 'root'
})
export class RarListService {

  constructor(private http: HttpClient) { }

  getAllMonstersWithLegendaryItems(): Observable<MonsterWithIncrustatedLegendaryItems[]> {
    return this.http.get<MonsterWithIncrustatedLegendaryItems[]>("/api/monsters");
  }

  getAllEpics(): Observable<IncrustatedLegendaryItem[]> {
    return this.http.get<IncrustatedLegendaryItem[]>("/api/items/legendary/family/EPIC");
  }

  getAllSets(): Observable<ItemSet[]> {
    return this.http.get<ItemSet[]>("/api/items/set");
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {MonsterWithIncrustatedLegendaryItems} from "@models/gameentites/monster";
import {IncrustatedLegendaryItem} from "@models/items/incrustatedLegendaryItem";
import {ItemSet} from "@models/set/itemSet";
import {ItemFamily} from "@models/items/itemFamily";
import {EpicDedicatedMod} from "@models/drif/epicDedicatedMod";

@Injectable({
  providedIn: 'root'
})
export class LegendaryItemsService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllMonstersWithLegendaryItems(): Observable<MonsterWithIncrustatedLegendaryItems[]> {
    return this.http.get<MonsterWithIncrustatedLegendaryItems[]>("/api/monsters");
  }

  getAllByFamily(family: ItemFamily): Observable<IncrustatedLegendaryItem[]> {
    return this.http.get<IncrustatedLegendaryItem[]>("/api/items/legendary/family/" + family);
  }

  getAllSets(): Observable<ItemSet[]> {
    return this.http.get<ItemSet[]>("/api/items/set");
  }

  getEpicsDedicatedMods(): Observable<EpicDedicatedMod[]> {
    return this.http.get<EpicDedicatedMod[]>("/api/items/legendary/epics-mods");
  }
}

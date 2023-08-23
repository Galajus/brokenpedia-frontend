import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Monster} from "../../../common/model/gameentites/monster";

@Injectable({
  providedIn: 'root'
})
export class RarListService {

  constructor(private http: HttpClient) { }

  getAllMonstersWithLegendaryItems(): Observable<Monster[]> {
    return this.http.get<Monster[]>("/api/monsters");
  }
}

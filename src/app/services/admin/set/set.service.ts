import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {ItemSet} from "@models/set/itemSet";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SetService {

  constructor(private http: HttpClient) { }

  getAllSets(): Observable<ItemSet[]> {
    return this.http.get<ItemSet[]>("/api/admin/items/set");
  }

  getSetById(id: number): Observable<ItemSet> {
    return this.http.get<ItemSet>("/api/admin/items/set/" + id);
  }

  createSet(set: ItemSet): Observable<ItemSet> {
    return this.http.post<ItemSet>("/api/admin/items/set", set);
  }

  updateSet(set: ItemSet): Observable<ItemSet> {
    return this.http.put<ItemSet>("/api/admin/items/set", set);
  }

  deleteSetById(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/items/set/" + id);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LegendaryItem} from "../../../models/items/legendaryItem";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private http: HttpClient
  ) { }

  getItems(): Observable<LegendaryItem[]> {
    return this.http.get<LegendaryItem[]>("/api/admin/items/legendary");
  }

  getItem(id: number): Observable<LegendaryItem> {
    return this.http.get<LegendaryItem>("/api/admin/items/legendary/" + id);
  }

  createItem(item: LegendaryItem): Observable<LegendaryItem> {
    return this.http.post<LegendaryItem>("/api/admin/items/legendary", item);
  }

  updateItem(item: LegendaryItem): Observable<LegendaryItem> {
    return this.http.put<LegendaryItem>("/api/admin/items/legendary", item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/items/legendary/" + id);
  }
}

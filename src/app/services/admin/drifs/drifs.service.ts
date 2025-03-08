import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Drif} from "@models/drif/drif";

@Injectable({
  providedIn: 'root'
})
export class DrifsService {

  constructor(private http: HttpClient) { }

  saveAllDrifsFromJson(drifs: Drif[]): Observable<Drif[]> {
    return this.http.post<Drif[]>("/api/admin/drifs/bulk", drifs);
  }

  getAllDrifs(): Observable<Drif[]> {
    return this.http.get<Drif[]>("/api/admin/drifs");
  }

  getDrif(id: number): Observable<Drif> {
    return this.http.get<Drif>("/api/admin/drifs/" + id);
  }

  createDrif(drif: Drif): Observable<Drif> {
    return this.http.post<Drif>("/api/admin/drifs", drif);
  }

  updateDrif(drif: Drif): Observable<Drif> {
    return this.http.put<Drif>("/api/admin/drifs", drif);
  }

  deleteDrif(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/drifs/" + id);
  }

}

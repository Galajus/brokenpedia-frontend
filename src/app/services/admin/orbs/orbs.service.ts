import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Orb} from "@models/orb/orb";

@Injectable({
  providedIn: 'root'
})
export class OrbsService {

  constructor(private http: HttpClient) { }

  getAllOrbs(): Observable<Orb[]> {
    return this.http.get<Orb[]>("/api/admin/orbs");
  }

  saveAllOrbsFromJson(orbs: Orb[]): Observable<Orb[]> {
    return this.http.post<Orb[]>("/api/admin/orbs/bulk", orbs);
  }

  getOrb(id: number): Observable<Orb> {
    return this.http.get<Orb>("/api/admin/orbs/" + id);
  }

  createOrb(orb: Orb): Observable<Orb> {
    return this.http.post<Orb>("/api/admin/orbs", orb);
  }

  updateOrb(orb: Orb): Observable<Orb> {
    return this.http.put<Orb>("/api/admin/orbs", orb);
  }

  deleteOrb(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/orbs/" + id);
  }
}

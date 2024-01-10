import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Orb} from "@models/orb/orb";

@Injectable({
  providedIn: 'root'
})
export class OrbsService {

  constructor(private http: HttpClient) { }

  saveAllOrbsFromJson(orbs: Orb[]): Observable<Orb[]> {
    return this.http.post<Orb[]>("/api/admin/orbs", orbs);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Profile} from "./model/profile";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  getProfile(uuid: string): Observable<Profile> {
    return this.http.get<Profile>("/api/profile/" + uuid);
  }
}

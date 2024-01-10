import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Profile} from "@models/user/profile";
import {ProfileNicknameDto} from "@models/user/profileNicknameDto";
import {BuildListDto} from "@models/build-list/buildListDto";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>("/api/profile");
  }

  getBuildsList(): Observable<Array<BuildListDto>> {
    return this.http.get<Array<BuildListDto>>("/api/profile/builds/builds-list");
  }

  deleteBuild(id: number): Observable<void> {
    return this.http.delete<void>("/api/profile/builds/" + id);
  }

  updateNick(update: ProfileNicknameDto): Observable<void> {
    return this.http.put<void>("/api/profile/nickname", update);
  }
}

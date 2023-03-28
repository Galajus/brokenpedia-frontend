import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Profile} from "./model/profile";
import {DatabaseBuild} from "../../build-calculator/model/databaseBuild";
import {BuildListDto} from "../../../../common/model/buildListDto";
import {ProfileNicknameDto} from "./model/profileNicknameDto";

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

  getBuildsList(uuid: string): Observable<Array<BuildListDto>> {
    return this.http.get<Array<BuildListDto>>("/api/profile/builds/builds-list/" + uuid);
  }

  deleteBuild(id: number): Observable<void> {
    return this.http.delete<void>("/api/profile/builds/delete/" + id);
  }

  updateNick(update: ProfileNicknameDto, uuid: string): Observable<void> {
    console.log(update)
    return this.http.put<void>("/api/profile/nickname/" + uuid, update);
  }
}

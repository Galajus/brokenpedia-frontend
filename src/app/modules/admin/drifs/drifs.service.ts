import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Drif} from "../../../common/model/drif/drif";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class DrifsService {

  constructor(private http: HttpClient) { }

  saveAllDrifsFromJson(drifs: Drif[]): Observable<Drif[]> {
    return this.http.post<Drif[]>("/api/admin/drifs", drifs);
  }

}

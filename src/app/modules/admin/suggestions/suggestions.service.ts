import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Suggestion} from "../../../common/model/suggestion/suggestion";

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {

  constructor(
    private http: HttpClient
  ) { }

  getSuggestions(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>("/api/admin/suggestions")
  }

  deleteSuggestion(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/suggestions/" + id);
  }
}

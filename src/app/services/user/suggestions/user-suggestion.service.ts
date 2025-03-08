import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Suggestion} from "@models/suggestion/suggestion";

@Injectable({
  providedIn: 'root'
})
export class UserSuggestionService {

  constructor(private http: HttpClient) { }

  saveSuggestion(suggestion: Suggestion): Observable<void> {
    return this.http.post<void>("/api/suggestions/add", suggestion);
  }

  getSuggestionsByStatus(status: string): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>("/api/suggestions/" + status);
  }
}

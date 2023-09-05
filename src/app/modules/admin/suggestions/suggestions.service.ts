import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Suggestion} from "../../../common/model/suggestion/suggestion";
import {SuggestionStatus} from "../../../common/model/suggestion/suggestionStatus";

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

  changeSuggestionStatus(id: number, status: SuggestionStatus): Observable<void> {
    return this.http.put<void>(
      "/api/admin/suggestions/change-status",
      {},
      {params: {
        id: id,
        status: status
      }});
  }

  changeSuggestionAdminComment(id: number, comment: string): Observable<void> {
    return this.http.put<void>(
      "/api/admin/suggestions/change-comment",
      {},
      {params: {
          id: id,
          comment: comment
        }});
  }
}

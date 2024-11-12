import { Injectable } from '@angular/core';
import {DictionaryEntry} from "@models/dictionary/dictionaryEntry";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(
    private http: HttpClient
  ) { }

  getAllDictionaryEntry(): Observable<DictionaryEntry[]> {
    return this.http.get<DictionaryEntry[]>("/api/admin/dictionary");
  }

  deleteDictionaryEntry(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/dictionary/" + id);
  }

  createDictionaryEntry(entry: DictionaryEntry): Observable<DictionaryEntry> {
    return this.http.post<DictionaryEntry>("/api/admin/dictionary", entry);
  }

  patchDictionaryEntryEntry(id: number, value: String): Observable<void> {
    return this.http.patch<void>("/api/admin/dictionary/patch-entry/" + id, value);
  }

  patchDictionaryEntryDescription(id: number, value: String): Observable<void> {
    return this.http.patch<void>("/api/admin/dictionary/patch-description/" + id, value);
  }

}

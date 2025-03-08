import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {DictionaryEntry} from "@models/dictionary/dictionaryEntry";

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(
    private http: HttpClient
  ) { }

  getAllDictionaryEntry(): Observable<DictionaryEntry[]> {
    return this.http.get<DictionaryEntry[]>("/api/dictionary");
  }
}

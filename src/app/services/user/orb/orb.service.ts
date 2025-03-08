import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Orb} from "@models/orb/orb";

@Injectable({
  providedIn: 'root'
})
export class OrbService {

  constructor(private http: HttpClient) { }

  getAllOrbs(): Observable<Orb[]> {
    return this.http.get<Orb[]>("/api/orbs")
  }
}

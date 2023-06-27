import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Post} from "../../admin/posts/model/post";
import {PageableMainPagePostDto} from "./model/pageableMainPagePostDto";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getPosts(page: number): Observable<PageableMainPagePostDto<Post>> { //todo page support
    return this.http.get<PageableMainPagePostDto<Post>>("/api/posts");
  }
}

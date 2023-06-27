import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {PageableMainPagePostDto} from "../home/model/pageableMainPagePostDto";
import {Post} from "../../admin/posts/model/post";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getPosts(page: number, category: string): Observable<PageableMainPagePostDto<Post>> { //todo page support
    return this.http.get<PageableMainPagePostDto<Post>>("/api/posts/category/" + category);
  }
}

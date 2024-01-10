import {Injectable} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {PageableMainPagePostDto} from "@models/post/pageableMainPagePostDto";
import {Post} from "@models/post/post";
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

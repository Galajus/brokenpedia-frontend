import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "./model/post";
import {Observable} from "rxjs/internal/Observable";
import {Category} from "./model/category";
import {PageableMainPagePostDto} from "../../user/home/model/pageableMainPagePostDto";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }

  getSinglePost(id: number): Observable<Post> {
    return this.http.get<Post>("/api/admin/posts/" + id);
  }

  getPosts(page: number): Observable<PageableMainPagePostDto<Post>> {
    return this.http.get<PageableMainPagePostDto<Post>>("/api/admin/posts");
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>("/api/admin/posts", post);
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>("/api/admin/posts", post);
  }

  getCategories(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>("/api/admin/categories");
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/posts/" + id);
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {SinglePost} from "../../../models/post/singlePost";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getSinglePost(slug: string): Observable<SinglePost> {
    return this.http.get<SinglePost>("/api/posts/" + slug);
  }
}

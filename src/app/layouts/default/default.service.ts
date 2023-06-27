import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Category} from "../../modules/admin/posts/model/category";

@Injectable({
  providedIn: 'root'
})
export class DefaultService {

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>("/api/categories/all");
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Category} from "@models/post/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>("/api/admin/categories");
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>("/api/admin/categories/" + id);
  }

  createCategory(cat: Category): Observable<Category> {
    return this.http.post<Category>("/api/admin/categories", cat);
  }

  updateCategory(cat: Category): Observable<Category> {
    return this.http.put<Category>("/api/admin/categories", cat);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>("/api/admin/categories/" + id);
  }

}

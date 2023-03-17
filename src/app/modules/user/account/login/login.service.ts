import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  register(register: any): Observable<any> {
    return this.http.post("/api/register", register);
  }

  login(login: any): Observable<any> {
    return this.http.post("/api/login", login);
  }

  activateAccount(hash: any): Observable<any> {
    return this.http.post("/api/confirmAccount", hash);
  }

  lostPassword(emailObject: any): Observable<any> {
    return this.http.post("/api/lostPassword", emailObject);
  }

  changePassword(passwordObject: any): Observable<any> {
    return this.http.post("/api/changePassword", passwordObject);
  }
}

import {Injectable} from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  setToken(token: string) {
    localStorage.setItem("token", token);
  }
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isLoggedIn():boolean {
    let token = this.getToken();
    return (token != null && this.notExpired(token));
  }

  getUuid(): string | null {
    let token = this.getToken();
    if (token == null) {
      return null;
    }
    let tokenDecoded = jwtDecode<any>(token);
    return tokenDecoded.sub;
  }

  logOut() {
    localStorage.removeItem("token");
  }

  private notExpired(token: string): boolean {
    let tokenDecoded = jwtDecode<any>(token);
    return (tokenDecoded.exp * 1000) > new Date().getTime();
  }

  public hasAdminAccess(): boolean {
    let token = this.getToken();
    if (!token) {
      return false;
    }
    let tokenDecoded = jwtDecode<any>(token);
    return tokenDecoded.var.includes('a');
  }

  public hasModeratorAccess(): boolean {
    let token = this.getToken();
    if (!token) {
      return false;
    }
    let tokenDecoded = jwtDecode<any>(token);
    return tokenDecoded.var.includes('b');
  }
}

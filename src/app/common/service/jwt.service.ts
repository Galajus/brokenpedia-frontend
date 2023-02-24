import { Injectable } from '@angular/core';
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  adminAccess = false;
  moderatorAccess = false;

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

  private notExpired(token: string): boolean {
    let tokenDecoded = jwtDecode<any>(token);
    return (tokenDecoded.exp * 1000) > new Date().getTime();
  }

  public setAdminAccess(adminAccess: boolean) {
    this.adminAccess = adminAccess;
  }

  public getAdminAccess(): boolean {
    return this.adminAccess;
  }

  public setModeratorAccess(moderatorAccess: boolean) {
    this.moderatorAccess = moderatorAccess;
  }

  public getModeratorAccess(): boolean {
    return this.moderatorAccess;
  }
}

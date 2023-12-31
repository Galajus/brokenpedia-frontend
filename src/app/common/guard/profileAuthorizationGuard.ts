import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {JwtService} from "../service/jwt.service";
import {Observable} from "rxjs";
import {LoginButtonService} from "../service/login-button.service";

@Injectable()
export class ProfileAuthorizationGuard implements CanActivate {
  constructor(private jwtService: JwtService,
              private loginButtonService: LoginButtonService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.jwtService.isLoggedIn()) {
      this.loginButtonService.loggedIn(false);
      this.router.navigate(["/login"]);
    }
    return true;
  }
}

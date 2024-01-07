import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Injectable} from "@angular/core";
import {JwtService} from "../services/jwt/jwt.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private jwtService: JwtService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.startsWith("/api/profile") && !req.url.startsWith("/api/admin")) {
      return next.handle(req);
    }

      let token = this.jwtService.getToken();

      if (!token) {
        return next.handle(req);
      }

      req = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token)
      });

      return next.handle(req);
  }

}

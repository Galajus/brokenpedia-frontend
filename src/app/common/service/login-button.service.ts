import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginButtonService {

  subject: Subject<boolean> = new Subject();
  constructor() { }

  loggedIn(loggedIn: boolean) {
    this.subject.next(loggedIn);
  }
}

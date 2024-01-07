import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LoginService} from "../../../../../services/user/account/login.service";

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {

  hash = "";
  success = true;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.hash = this.route.snapshot.params['hash'];
    this.loginService.activateAccount({
      hash: this.hash
    })
      .subscribe({
        next: response => {
          console.log(response.confirmed)
          this.success = response.confirmed;
        },
         error: err => this.success = false
      })
    console.log(this.success)
  }

}

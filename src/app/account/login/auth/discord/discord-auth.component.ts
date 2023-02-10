import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../../layouts/default/model/user";

@Component({
  selector: 'app-discord-auth',
  templateUrl: './discord-auth.component.html',
  styleUrls: ['./discord-auth.component.scss']
})
export class DiscordAuthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment == null) {
        return;
      }
      let urlParams = new URLSearchParams(fragment);

      let user: User;
      let type: string = "";
      let token: string = "";
      urlParams.forEach((v, k) => {
        console.log(k + ": " + v);
        if (k == "token_type") {
          type = v;
        }
        if (k == "access_token") {
          token = v;
        }

      })

      user = {
        token_type: type,
        access_token: token
      }

    })
  }
}

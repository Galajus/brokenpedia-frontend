import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-discord-api-redirect',
  templateUrl: './discord-api-redirect.component.html',
  styleUrls: ['./discord-api-redirect.component.scss']
})
export class DiscordApiRedirectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1063410191812526172&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin%2Fauth%2Fdiscord&response_type=token&scope=identify";
  }

}

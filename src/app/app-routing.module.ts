import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BrokencalcComponent} from "./brokencalc/brokencalc.component";
import {HomeComponent} from "./home/home.component";
import {DefaultComponent} from "./layouts/default/default.component";
import {LoginComponent} from "./account/login/login.component";
import {DashboardComponent} from "./account/dashboard/dashboard.component";
import {DiscordApiRedirectComponent} from "./account/login/discord-api-redirect/discord-api-redirect.component";
import {PageNotFoundComponent} from "./error/page-not-found/page-not-found.component";
import {DiscordAuthComponent} from "./account/login/auth/discord/discord-auth.component";

const routes: Routes = [

  {
    path:'', component: DefaultComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'br', component: BrokencalcComponent },
      { path: 'build-calculator', component: BrokencalcComponent },
      /*{ path: 'login', component: LoginComponent },
      { path: 'login/discord-api', component: DiscordApiRedirectComponent },
      { path: 'login/auth/discord', component: DiscordAuthComponent },

      { path: 'acc', component: DashboardComponent },
      { path: 'acc/dashboard', component: DashboardComponent },*/

      { path: '**', component: PageNotFoundComponent}
      ]

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

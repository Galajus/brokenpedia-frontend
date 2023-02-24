import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrokencalcComponent} from "./modules/user/build-calculator/brokencalc.component";
import {HomeComponent} from "./modules/user/home/home.component";
import {DefaultComponent} from "./layouts/default/default.component";
import {PageNotFoundComponent} from "./error/page-not-found/page-not-found.component";
import {BrokenHelperComponent} from "./modules/user/broken-helper/broken-helper.component";
import {EssenceCalculatorComponent} from "./modules/user/essence-calculator/essence-calculator.component";
import {PsychoExpCalculatorComponent} from "./modules/user/psycho-exp-calculator/psycho-exp-calculator.component";
import {TestsComponent} from "./modules/user/tests/tests.component";
import {LoginComponent} from "./modules/user/account/login/login.component";
import {DashboardComponent} from "./modules/user/account/dashboard/dashboard.component";

const routes: Routes = [

  {

    path:'', component: DefaultComponent, title: "Aktualności", children: [
      { path: '', component: HomeComponent, title: "Aktualności" },
      { path: 'br', component: BrokencalcComponent, title: "Kalkulator buildów" },
      { path: 'build-calculator', component: BrokencalcComponent, title: "Kalkulator buildów" },
      { path: 'broken-helper', component: BrokenHelperComponent, title: "Broken Helper" },
      { path: 'essence-calculator', component: EssenceCalculatorComponent, title: "Kalkulator esencji" },
      { path: 'psycho-calculator', component: PsychoExpCalculatorComponent, title: "Kalkulator psychoexpa" },
      { path: 'login', component: LoginComponent, title: "Logowanie/rejestracja" },
      /*{ path: 'tests', component: TestsComponent, title: "test" },
      { path: 'login', component: LoginComponent },
      { path: 'login/discord-api', component: DiscordApiRedirectComponent },
      { path: 'login/auth/discord', component: DiscordAuthComponent },*/

      { path: 'acc', component: DashboardComponent, title: "Profil"},
      { path: 'acc/dashboard', component: DashboardComponent,title: "Profil"},

      { path: '**', component: PageNotFoundComponent, title: "404"}
      ],


  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

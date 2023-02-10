import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrokencalcComponent} from "./custom-pages/build-calculator/brokencalc.component";
import {HomeComponent} from "./home/home.component";
import {DefaultComponent} from "./layouts/default/default.component";
import {PageNotFoundComponent} from "./error/page-not-found/page-not-found.component";
import {BrokenHelperComponent} from "./custom-pages/broken-helper/broken-helper.component";
import {EssenceCalculatorComponent} from "./custom-pages/essence-calculator/essence-calculator.component";
import {PsychoExpCalculatorComponent} from "./custom-pages/psycho-exp-calculator/psycho-exp-calculator.component";
import {TestsComponent} from "./custom-pages/tests/tests.component";

const routes: Routes = [

  {
    path:'', component: DefaultComponent, title: "Aktualności", children: [
      { path: '', component: HomeComponent, title: "Aktualności" },
      { path: 'br', component: BrokencalcComponent, title: "Kalkulator buildów" },
      { path: 'build-calculator', component: BrokencalcComponent, title: "Kalkulator buildów" },
      { path: 'broken-helper', component: BrokenHelperComponent, title: "Broken Helper" },
      { path: 'essence-calculator', component: EssenceCalculatorComponent, title: "Kalkulator esencji" },
      { path: 'psycho-calculator', component: PsychoExpCalculatorComponent, title: "Kalkulator psychoexpa" },
      { path: 'tests', component: TestsComponent, title: "test" },
      /*{ path: 'login', component: LoginComponent },
      { path: 'login/discord-api', component: DiscordApiRedirectComponent },
      { path: 'login/auth/discord', component: DiscordAuthComponent },

      { path: 'acc', component: DashboardComponent },
      { path: 'acc/dashboard', component: DashboardComponent },*/

      { path: '**', component: PageNotFoundComponent, title: "404"}
      ]

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

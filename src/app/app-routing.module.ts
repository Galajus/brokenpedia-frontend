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
import {ConfirmAccountComponent} from "./modules/user/account/login/confirm-account/confirm-account.component";
import {ProfileAuthorizationGuard} from "./common/guard/profileAuthorizationGuard";
import {LostPasswordComponent} from "./modules/user/account/login/lost-password/lost-password.component";
import {AdminComponent} from "./layouts/admin/admin.component";
import {SkillsComponent} from "./modules/admin/skills/skills.component";
import {AdminAuthorizationGuard} from "./common/guard/adminAuthorizationGuard";

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
      { path: 'confirm-account/:hash', component: ConfirmAccountComponent, title: "Aktywacja konta" },
      { path: 'lost-password', component: LostPasswordComponent, title: "Reset hasła" },
      { path: 'lost-password/:hash', component: LostPasswordComponent, title: "Reset hasła" },


      { path: 'acc', component: DashboardComponent, title: "Profil", canActivate: [ProfileAuthorizationGuard]},
      { path: 'acc/dashboard', component: DashboardComponent,title: "Profil", canActivate: [ProfileAuthorizationGuard]},
      ],

  },
  {
    path:'admin', component: AdminComponent, title:"Admin panel", children: [
      { path: '', component: SkillsComponent, title: "Admin skills", canActivate: [AdminAuthorizationGuard] },
      { path: 'skills', component: SkillsComponent, title: "Admin skills", canActivate: [AdminAuthorizationGuard] }
    ]
  },
  { path: '**', component: DefaultComponent, title: "404", children: [
      { path: '', component: PageNotFoundComponent, title: "404"}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

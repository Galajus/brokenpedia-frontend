import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrokencalcComponent} from "./modules/user/build-calculator/brokencalc.component";
import {HomeComponent} from "./modules/user/home/home.component";
import {DefaultComponent} from "./layouts/default/default.component";
import {PageNotFoundComponent} from "./error/page-not-found/page-not-found.component";
import {BrokenHelperComponent} from "./modules/user/broken-helper/broken-helper.component";
import {EssenceCalculatorComponent} from "./modules/user/essence-calculator/essence-calculator.component";
import {PsychoExpCalculatorComponent} from "./modules/user/psycho-exp-calculator/psycho-exp-calculator.component";
import {LoginComponent} from "./modules/user/account/login/login.component";
import {DashboardComponent} from "./modules/user/account/dashboard/dashboard.component";
import {ConfirmAccountComponent} from "./modules/user/account/login/confirm-account/confirm-account.component";
import {ProfileAuthorizationGuard} from "./common/guard/profileAuthorizationGuard";
import {LostPasswordComponent} from "./modules/user/account/login/lost-password/lost-password.component";
import {AdminComponent} from "./layouts/admin/admin.component";
import {SkillsComponent} from "./modules/admin/skills/skills.component";
import {AdminAuthorizationGuard} from "./common/guard/adminAuthorizationGuard";
import {SkillUpdateComponent} from "./modules/admin/skills/skill-update/skill-update.component";
import {BuildsListComponent} from "./modules/user/build-calculator/builds-list/builds-list.component";
import {DrifSimulatorComponent} from "./modules/user/drif-simulator/drif-simulator.component";
import {ImportantModsComponent} from "./modules/user/tips/important-mods/important-mods.component";
import {PostsComponent} from "./modules/admin/posts/posts.component";
import {PostAddComponent} from "./modules/admin/posts/post-add/post-add.component";
import {PostEditComponent} from "./modules/admin/posts/post-edit/post-edit.component";
import {CategoryComponent} from "./modules/user/category/category.component";
import {PostComponent} from "./modules/user/post/post.component";
import {CategoryAddComponent} from "./modules/admin/category/category-add/category-add.component";
import {CategoryUpdateComponent} from "./modules/admin/category/category-update/category-update.component";
import {AdminCategoryComponent} from "./modules/admin/category/admin-category.component";
import {PrivacyPolicyComponent} from "./modules/user/privacy-policy/privacy-policy.component";
import {UpgradeSimulatorComponent} from "./modules/user/upgrade-simulator/upgrade-simulator.component";
import {InventoryComponent} from "./modules/admin/inventory/inventory.component";
import {CreateRarComponent} from "./modules/admin/inventory/create-rar/create-rar.component";
import {UpdateRarComponent} from "./modules/admin/inventory/update-rar/update-rar.component";
import {MonsterComponent} from "./modules/admin/monster/monster.component";
import {MonsterAddComponent} from "./modules/admin/monster/monster-add/monster-add.component";
import {MonsterUpdateComponent} from "./modules/admin/monster/monster-update/monster-update.component";
import {RarListComponent} from "./modules/user/rar-list/rar-list.component";
import {SuggestionsComponent} from "./modules/admin/suggestions/suggestions.component";
import {UserSuggestionComponent} from "./modules/user/user-suggestion/user-suggestion.component";
import {OrbsTableComponent} from "./modules/user/orbs-table/orbs-table.component";
import {DrifsComponent} from "./modules/admin/drifs/drifs.component";
import {OrbsComponent} from "./modules/admin/orbs/orbs.component";

const routes: Routes = [

  {

    path:'', component: DefaultComponent, title: "Aktualności", children: [
      { path: '', component: HomeComponent, title: "Aktualności" },
      { path: 'br', component: BrokencalcComponent, title: "Kalkulator buildów" },
      { path: 'build-calculator', component: BrokencalcComponent, title: "Kalkulator buildów" },
      { path: 'build-calculator/build/:id', component: BrokencalcComponent, title: "Kalkulator buildów" },
      { path: 'build-calculator/builds', component: BuildsListComponent, title: "Lista buildów" },
      { path: 'items-list', component: RarListComponent, title: "Lista przedmiotów" },
      { path: 'broken-helper', component: BrokenHelperComponent, title: "Broken Helper" },
      { path: 'essence-calculator', component: EssenceCalculatorComponent, title: "Kalkulator esencji" },
      { path: 'psycho-calculator', component: PsychoExpCalculatorComponent, title: "Kalkulator psychoexpa" },
      { path: 'drif-simulator', component: DrifSimulatorComponent, title: "Symulator drifów" },
      { path: 'upgrade-simulator', component: UpgradeSimulatorComponent, title: "Symulator ulepszania" },
      { path: 'important-mods', component: ImportantModsComponent, title: "Modyfikatory dla klas postaci" },
      { path: 'orbs-table', component: OrbsTableComponent, title: "Tabela orbów" },
      /*{ path: 'test', component: TestsComponent, title: "TESTS" },*/

      { path: 'suggestion', component: UserSuggestionComponent, title: "Zgłoś błąd lub sugestię" },

      { path: 'post/:slug', component: PostComponent, title: "Post" },
      { path: 'category/:slug', component: CategoryComponent, title: "Category" },

      { path: 'login', component: LoginComponent, title: "Logowanie/rejestracja" },
      { path: 'confirm-account/:hash', component: ConfirmAccountComponent, title: "Aktywacja konta" },
      { path: 'lost-password', component: LostPasswordComponent, title: "Reset hasła" },
      { path: 'lost-password/:hash', component: LostPasswordComponent, title: "Reset hasła" },
      { path: 'privacy-policy', component: PrivacyPolicyComponent, title: "Polityka prywatności" },


      { path: 'acc', component: DashboardComponent, title: "Profil", canActivate: [ProfileAuthorizationGuard]},
      { path: 'acc/dashboard', component: DashboardComponent,title: "Profil", canActivate: [ProfileAuthorizationGuard]},
      ],

  },
  {
    path:'admin', component: AdminComponent, title:"Admin panel", children: [
      { path: '', component: SkillsComponent, title: "Admin skills", canActivate: [AdminAuthorizationGuard] },
      { path: 'skills', component: SkillsComponent, title: "Admin skills", canActivate: [AdminAuthorizationGuard] },
      { path: 'skills/update/:id', component: SkillUpdateComponent, title: "Admin skill update", canActivate: [AdminAuthorizationGuard] },
      { path: 'posts', component: PostsComponent, title: "Admin posts", canActivate: [AdminAuthorizationGuard] },
      { path: 'posts/add', component: PostAddComponent, title: "Admin post create", canActivate: [AdminAuthorizationGuard] },
      { path: 'posts/update/:id', component: PostEditComponent, title: "Admin post update", canActivate: [AdminAuthorizationGuard] },
      { path: 'categories', component: AdminCategoryComponent, title: "Admin categories", canActivate: [AdminAuthorizationGuard] },
      { path: 'categories/add', component: CategoryAddComponent, title: "Admin category create", canActivate: [AdminAuthorizationGuard] },
      { path: 'categories/update/:id', component: CategoryUpdateComponent, title: "Admin category update", canActivate: [AdminAuthorizationGuard] },
      { path: 'inventory', component: InventoryComponent, title: "Admin inventory", canActivate: [AdminAuthorizationGuard] },
      { path: 'inventory/add', component: CreateRarComponent, title: "Admin create rar", canActivate: [AdminAuthorizationGuard] },
      { path: 'inventory/update/:id', component: UpdateRarComponent, title: "Admin update rar", canActivate: [AdminAuthorizationGuard] },
      { path: 'monster', component: MonsterComponent, title: "Admin monsters", canActivate: [AdminAuthorizationGuard] },
      { path: 'monster/add', component: MonsterAddComponent, title: "Admin create monsters", canActivate: [AdminAuthorizationGuard] },
      { path: 'monster/update/:id', component: MonsterUpdateComponent, title: "Admin update monsters", canActivate: [AdminAuthorizationGuard] },
      { path: 'suggestions', component: SuggestionsComponent, title: "Admin suggestions", canActivate: [AdminAuthorizationGuard] },
      { path: 'drifs', component: DrifsComponent, title: "Drifs", canActivate: [AdminAuthorizationGuard] },
      { path: 'orbs', component: OrbsComponent, title: "Orbs", canActivate: [AdminAuthorizationGuard] },
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

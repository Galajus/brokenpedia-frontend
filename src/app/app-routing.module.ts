import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from "./layouts/default/default.component";
import {PageNotFoundComponent} from "./components/common/page-not-found/page-not-found.component";
import {ProfileAuthorizationGuard} from "./guards/profileAuthorizationGuard";
import {AdminComponent} from "./layouts/admin/admin.component";
import {AdminAuthorizationGuard} from "./guards/adminAuthorizationGuard";
import {BrokencalcComponent} from "./components/user/build-calculator/brokencalc.component";
import {BrokenHelperComponent} from "./components/user/broken-helper/broken-helper.component";
import {EssenceCalculatorComponent} from "./components/user/essence-calculator/essence-calculator.component";
import {PsychoExpCalculatorComponent} from "./components/user/psycho-exp-calculator/psycho-exp-calculator.component";
import {LoginComponent} from "./components/user/account/login/login.component";
import {ConfirmAccountComponent} from "./components/user/account/login/confirm-account/confirm-account.component";
import {DashboardComponent} from "./components/user/account/dashboard/dashboard.component";
import {LostPasswordComponent} from "./components/user/account/login/lost-password/lost-password.component";
import {SkillsComponent} from "./components/admin/skills/skills.component";
import {HomeComponent} from "./components/user/home/home.component";
import {BuildsListComponent} from "./components/user/build-calculator/builds-list/builds-list.component";
import {RarListComponent} from "./components/user/rar-list/rar-list.component";
import {DrifSimulatorComponent} from "./components/user/drif-simulator/drif-simulator.component";
import {UpgradeSimulatorComponent} from "./components/user/upgrade-simulator/upgrade-simulator.component";
import {ImportantModsComponent} from "./components/user/tips/important-mods/important-mods.component";
import {OrbsTableComponent} from "./components/user/orbs-table/orbs-table.component";
import {UserSuggestionComponent} from "./components/user/user-suggestion/user-suggestion.component";
import {PostComponent} from "./components/user/post/post.component";
import {CategoryComponent} from "./components/user/category/category.component";
import {PrivacyPolicyComponent} from "./components/user/privacy-policy/privacy-policy.component";
import {SkillUpdateComponent} from "./components/admin/skills/skill-update/skill-update.component";
import {PostsComponent} from "./components/admin/posts/posts.component";
import {PostAddComponent} from "./components/admin/posts/post-add/post-add.component";
import {PostEditComponent} from "./components/admin/posts/post-edit/post-edit.component";
import {AdminCategoryComponent} from "./components/admin/category/admin-category.component";
import {CategoryAddComponent} from "./components/admin/category/category-add/category-add.component";
import {CategoryUpdateComponent} from "./components/admin/category/category-update/category-update.component";
import {InventoryComponent} from "./components/admin/inventory/inventory.component";
import {CreateRarComponent} from "./components/admin/inventory/create-rar/create-rar.component";
import {UpdateRarComponent} from "./components/admin/inventory/update-rar/update-rar.component";
import {MonsterComponent} from "./components/admin/monster/monster.component";
import {MonsterAddComponent} from "./components/admin/monster/monster-add/monster-add.component";
import {MonsterUpdateComponent} from "./components/admin/monster/monster-update/monster-update.component";
import {SuggestionsComponent} from "./components/admin/suggestions/suggestions.component";
import {DrifsComponent} from "./components/admin/drifs/drifs.component";
import {OrbsComponent} from "./components/admin/orbs/orbs.component";
import {UpdateOrbComponent} from "@app/components/admin/orbs/update-orb/update-orb.component";
import {SetsComponent} from "@app/components/admin/sets/sets.component";
import {SetsCreateComponent} from "@app/components/admin/sets/sets-create/sets-create.component";
import {SetsUpdateComponent} from "@app/components/admin/sets/sets-update/sets-update.component";
import {UpdateDrifComponent} from "@app/components/admin/drifs/update-drif/update-drif.component";

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
      { path: 'drifs/update/:id', component: UpdateDrifComponent, title: "Admin update drif", canActivate: [AdminAuthorizationGuard] },
      { path: 'orbs', component: OrbsComponent, title: "Orbs", canActivate: [AdminAuthorizationGuard] },
      { path: 'orbs/update/:id', component: UpdateOrbComponent, title: "Admin update orb", canActivate: [AdminAuthorizationGuard] },
      { path: 'sets', component: SetsComponent, title: "Admin sets", canActivate: [AdminAuthorizationGuard] },
      { path: 'sets/add', component: SetsCreateComponent, title: "Admin create set", canActivate: [AdminAuthorizationGuard] },
      { path: 'sets/update/:id', component: SetsUpdateComponent, title: "Admin update set", canActivate: [AdminAuthorizationGuard] },
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

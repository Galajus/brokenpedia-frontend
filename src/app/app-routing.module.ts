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
import {DictionaryComponent} from "@app/components/admin/dictionary/dictionary.component";
import {DictionaryEntryListComponent} from "@app/components/user/dictionary-entry-list/dictionary-entry-list.component";
import {DrifTableComponent} from "@app/components/user/drif-table/drif-table.component";
import {UnsavedChangesGuard} from "@app/guards/unsaved-changes.guard";

const routes: Routes = [

  {

    path:'', component: DefaultComponent, title: "Brokenpedia.com - Wikipedia Broken Ranks", children: [
      { path: '', component: HomeComponent, title: "Brokenpedia.com - Wikipedia Broken Ranks", data: {description: "Witaj na stronie głównej Brokenpedii"} },
      { path: 'build-calculator', component: BrokencalcComponent, title: "Kalkulator buildów", data: {description: "Zasymuluj swój build, zasymuluj umiejętnośći, ekwipunek czy drify"} },
      { path: 'build-calculator/build/:id', component: BrokencalcComponent, title: "Kalkulator buildów", data: {description: "Przegląd zapisanego buildu w kalkulatorze"} },
      { path: 'build-calculator/builds', component: BuildsListComponent, title: "Lista buildów", data: {description: "Lista buildów zapisana przez użytkowników"}},
      { path: 'items-list', component: RarListComponent, title: "Lista przedmiotów", data: {description: "Lista wszystkich rzadkich przedmiotów w grze: Rarów, Setów, Epików, Synergetyków"} },
      { path: 'broken-helper', component: BrokenHelperComponent, title: "Broken Helper", data: {description: "Discordowy bot pomocnik do zadań dziennych i odbierania wejściówek"}},
      { path: 'essence-calculator', component: EssenceCalculatorComponent, title: "Kalkulator esencji i odłamków" , data: {description: "Obliczanie uzyskania esencji i odłamków z przedmiotów oraz zarobku z nich"}},
      { path: 'psycho-calculator', component: PsychoExpCalculatorComponent, title: "Kalkulator psychoexpa", data: {description: "Sprawdź ile czasu zajmie Ci zdobycie określonego poziomu wyexpienia na drifie"}},
      { path: 'drif-simulator', component: DrifSimulatorComponent, title: "Symulator drifów", canDeactivate: [UnsavedChangesGuard], data: {description: "Dedykowany symulator drifów oferujący bardzo wygodne rozplanowanie ułożenia ich w Twoim sprzęcie"}},
      { path: 'upgrade-simulator', component: UpgradeSimulatorComponent, title: "Symulator ulepszania", data: {description: "Zasymuluj proces ulepszania sprzętu w grze i sprawdź ile może Cię to kosztować"} },
      { path: 'important-mods', component: ImportantModsComponent, title: "Modyfikatory dla klas postaci", data: {description: "Sprawdź jakie modyfikatory / psychowłaściwości będą najbardziej użyteczne dla Twojej klasy postaci"} },
      { path: 'orbs-table', component: OrbsTableComponent, title: "Tabela orbów", data: {description: "Lista wsyzstkich orbów w grze wraz z uwzględnieniem ich siły działania w zależności od inkrustacji"}},
      { path: 'dictionary', component: DictionaryEntryListComponent, title: "Słowniczek", data: {description: "Słowniczek dla nowych graczy aby szybko odnaleźli się w trudnym słownictwie graczy Broken Ranks"} },
      { path: 'drifs-table', component: DrifTableComponent, title: "Tabela drifów", data: {description: "Tabela drifów z możliwościa sprawdzenia ich włąsciwości w zależności od ich poziomu"} },
      //{ path: 'skins', component: SkinsComponent, title: "SKINY", data: {description: "SKINY"} },
      /*{ path: 'test', component: TestsComponent, title: "TESTS" },*/

      { path: 'suggestion', component: UserSuggestionComponent, title: "Zgłoś błąd lub sugestię", data: {description: "Zaproponuj ulepszenie wikipedii lub zgłoś błąd"} },

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
      { path: 'dictionary', component: DictionaryComponent, title: "Admin dictionary", canActivate: [AdminAuthorizationGuard] },
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

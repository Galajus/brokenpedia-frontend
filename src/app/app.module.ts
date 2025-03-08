import {NgModule} from '@angular/core';
import {BrowserModule, REMOVE_STYLES_ON_COMPONENT_DESTROY} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatBadgeModule} from "@angular/material/badge";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DefaultComponent} from './layouts/default/default.component';
import {PageNotFoundComponent} from './components/common/page-not-found/page-not-found.component';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from "ngx-cookieconsent";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {ProfileAuthorizationGuard} from "./guards/profileAuthorizationGuard";
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import {AdminComponent} from './layouts/admin/admin.component';
import {AdminAuthorizationGuard} from "./guards/adminAuthorizationGuard";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {MatTreeModule} from "@angular/material/tree";
import {MatExpansionModule} from "@angular/material/expansion";
import {NgOptimizedImage, registerLocaleData} from "@angular/common";
import localePl from '@angular/common/locales/pl'
import localePlExtra from '@angular/common/locales/extra/pl';
import {SimpleDate} from "./pipes/simple-date";
import {NoSanitize} from "./pipes/no-sanitize";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {AdsenseModule} from "ng2-adsense";
import {MatSortModule} from "@angular/material/sort";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {Underscore} from "./pipes/underscore";
import {NgVarDirective} from "./directives/ng-var.directive";
import {OverlayModule} from "@angular/cdk/overlay";
import {ArabianPipe} from './pipes/arabian.pipe';
import {BrokencalcComponent} from "./components/user/build-calculator/brokencalc.component";
import {HomeComponent} from "./components/user/home/home.component";
import {InfoDialogComponent} from "./components/user/build-calculator/info-dialog/info-dialog.component";
import {TestsComponent} from "./components/user/tests/tests.component";
import {ConfirmAccountComponent} from "./components/user/account/login/confirm-account/confirm-account.component";
import {LostPasswordComponent} from "./components/user/account/login/lost-password/lost-password.component";
import {
  SkillLevelSelectComponent
} from "./components/user/build-calculator/skill-level-select/skill-level-select.component";
import {SkillsComponent} from "./components/admin/skills/skills.component";
import {SkillUpdateComponent} from "./components/admin/skills/skill-update/skill-update.component";
import {BuildsListComponent} from "./components/user/build-calculator/builds-list/builds-list.component";
import {DrifSimulatorComponent} from "./components/user/drif-simulator/drif-simulator.component";
import {ImportantModsComponent} from "./components/user/tips/important-mods/important-mods.component";
import {DrifSelectComponent} from "./components/user/drif-simulator/drif-select/drif-select.component";
import {PostsComponent} from "./components/admin/posts/posts.component";
import {PostAddComponent} from "./components/admin/posts/post-add/post-add.component";
import {PostEditComponent} from "./components/admin/posts/post-edit/post-edit.component";
import {PostComponent} from "./components/user/post/post.component";
import {CategoryComponent} from "./components/user/category/category.component";
import {AdminCategoryComponent} from "./components/admin/category/admin-category.component";
import {CategoryAddComponent} from "./components/admin/category/category-add/category-add.component";
import {CategoryUpdateComponent} from "./components/admin/category/category-update/category-update.component";
import {PrivacyPolicyComponent} from "./components/user/privacy-policy/privacy-policy.component";
import {UpgradeSimulatorComponent} from "./components/user/upgrade-simulator/upgrade-simulator.component";
import {InventoryComponent} from "./components/admin/inventory/inventory.component";
import {CreateRarComponent} from "./components/admin/inventory/create-rar/create-rar.component";
import {UpdateRarComponent} from "./components/admin/inventory/update-rar/update-rar.component";
import {MonsterComponent} from "./components/admin/monster/monster.component";
import {MonsterAddComponent} from "./components/admin/monster/monster-add/monster-add.component";
import {MonsterUpdateComponent} from "./components/admin/monster/monster-update/monster-update.component";
import {RarListComponent} from "./components/user/rar-list/rar-list.component";
import {SuggestionsComponent} from "./components/admin/suggestions/suggestions.component";
import {UserSuggestionComponent} from "./components/user/user-suggestion/user-suggestion.component";
import {ItemComparatorComponent} from "./components/user/rar-list/item-comparator/item-comparator.component";
import {
  EditAdminCommentComponent
} from "./components/admin/suggestions/edit-admin-comment/edit-admin-comment.component";
import {OrbsTableComponent} from "./components/user/orbs-table/orbs-table.component";
import {DrifsComponent} from "./components/admin/drifs/drifs.component";
import {OrbsComponent} from "./components/admin/orbs/orbs.component";
import {DrifSumDialogComponent} from "./components/user/build-calculator/drif-sum-dialog/drif-sum-dialog.component";
import {LoginComponent} from "./components/user/account/login/login.component";
import {DashboardComponent} from "./components/user/account/dashboard/dashboard.component";
import {BrokenHelperComponent} from "./components/user/broken-helper/broken-helper.component";
import {PsychoExpCalculatorComponent} from "./components/user/psycho-exp-calculator/psycho-exp-calculator.component";
import {EssenceCalculatorComponent} from "./components/user/essence-calculator/essence-calculator.component";
import { UpdateOrbComponent } from './components/admin/orbs/update-orb/update-orb.component';
import { KeyArrayPipe } from './pipes/key-array.pipe';
import { SetsComponent } from './components/admin/sets/sets.component';
import { SetsUpdateComponent } from './components/admin/sets/sets-update/sets-update.component';
import { SetsCreateComponent } from './components/admin/sets/sets-create/sets-create.component';
import { UpdateDrifComponent } from './components/admin/drifs/update-drif/update-drif.component';
import { DqCounterComponent } from './components/user/dq-counter/dq-counter.component';
import {DictionaryComponent} from "@app/components/admin/dictionary/dictionary.component";
import { DictionaryEntryListComponent } from './components/user/dictionary-entry-list/dictionary-entry-list.component';
import { SkinsComponent } from './components/user/skins/skins.component';
import { DrifTableComponent } from './components/user/drif-table/drif-table.component';
import { TwitchStreamComponent } from './components/common/twitch-stream/twitch-stream.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSliderModule} from "@angular/material/slider";
import {MatTabsModule} from "@angular/material/tabs";
import {MatOptionModule} from "@angular/material/core";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FlexLayoutModule} from "ng-flex-layout";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatChip} from "@angular/material/chips";
import {
  CreateBuildDialogComponent
} from "@app/components/user/drif-simulator/create-build-dialog/create-build-dialog.component";


const cookieConfig:NgcCookieConsentConfig = {
  "cookie": {
    "domain": "brokenpedia.com"
  },
  "position": "bottom-right",
  "theme": "classic",
  "palette": {
    "popup": {
      "background": "#1e1e1e",
      "text": "#ffffff",
      "link": "#ffffff"
    },
    "button": {
      "background": "#efecdd",
      "text": "#000000",
      "border": "transparent"
    }
  },
  "type": "info",
  "content": {
    "message": "Ta strona korzysta z plików cookie, aby zapewnić najlepszą jakość korzystania z niej.",
    "dismiss": "Zrozumiałem!",
    "deny": "Odrzuć ciasteczka",
    "link": "Więcej o ciasteczkach",
    "href": "https://wszystkoociasteczkach.pl",
    "policy": "Cookie Policy"
  }
};

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

registerLocaleData(localePl, localePlExtra);

@NgModule({ declarations: [
        AppComponent,
        BrokencalcComponent,
        HomeComponent,
        InfoDialogComponent,
        DefaultComponent,
        LoginComponent,
        DashboardComponent,
        PageNotFoundComponent,
        BrokenHelperComponent,
        EssenceCalculatorComponent,
        PsychoExpCalculatorComponent,
        TestsComponent,
        ConfirmAccountComponent,
        LostPasswordComponent,
        SkillLevelSelectComponent,
        AdminComponent,
        SkillsComponent,
        SkillUpdateComponent,
        BuildsListComponent,
        DrifSimulatorComponent,
        ImportantModsComponent,
        DrifSelectComponent,
        PostsComponent,
        PostAddComponent,
        PostEditComponent,
        SimpleDate,
        PostComponent,
        CategoryComponent,
        NoSanitize,
        AdminCategoryComponent,
        CategoryAddComponent,
        CategoryUpdateComponent,
        PrivacyPolicyComponent,
        UpgradeSimulatorComponent,
        InventoryComponent,
        CreateRarComponent,
        UpdateRarComponent,
        MonsterComponent,
        MonsterAddComponent,
        MonsterUpdateComponent,
        RarListComponent,
        SuggestionsComponent,
        UserSuggestionComponent,
        ItemComparatorComponent,
        EditAdminCommentComponent,
        Underscore,
        OrbsTableComponent,
        NgVarDirective,
        DrifsComponent,
        OrbsComponent,
        ArabianPipe,
        DrifSumDialogComponent,
        UpdateOrbComponent,
        KeyArrayPipe,
        SetsComponent,
        SetsUpdateComponent,
        SetsCreateComponent,
        UpdateDrifComponent,
        DqCounterComponent,
        DictionaryComponent,
        DictionaryComponent,
        DictionaryEntryListComponent,
        SkinsComponent,
        DrifTableComponent,
        TwitchStreamComponent,
        CreateBuildDialogComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatBadgeModule,
    FlexLayoutModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    ReactiveFormsModule,
    AngularEditorModule,
    MatTreeModule,
    MatExpansionModule,
    NgOptimizedImage,
    DragDropModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-8605997221846310',
      adSlot: 7391443546,
    }),
    MatSortModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    OverlayModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSliderModule,
    MatTabsModule,
    MatOptionModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatListItem,
    MatCheckbox,
    MatList,
    MatRadioButton,
    MatRadioGroup,
    MatNavList, MatChip], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: false }, //todo maybe use native supported - how?
        ProfileAuthorizationGuard,
        AdminAuthorizationGuard,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }

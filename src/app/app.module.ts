import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {BrokencalcComponent} from './modules/user/build-calculator/brokencalc.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatBadgeModule} from "@angular/material/badge";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {HomeComponent} from './modules/user/home/home.component';
import {InfoDialogComponent} from './modules/user/build-calculator/info-dialog/info-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {FooterComponent} from './shared/components/footer/footer.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {DefaultComponent} from './layouts/default/default.component';
import {LoginComponent} from './modules/user/account/login/login.component';
import {DashboardComponent} from './modules/user/account/dashboard/dashboard.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrokenHelperComponent} from './modules/user/broken-helper/broken-helper.component';
import {EssenceCalculatorComponent} from './modules/user/essence-calculator/essence-calculator.component';
import {MatTableModule} from "@angular/material/table";
import {PsychoExpCalculatorComponent} from './modules/user/psycho-exp-calculator/psycho-exp-calculator.component';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from "ngx-cookieconsent";
import {TestsComponent} from './modules/user/tests/tests.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {ConfirmAccountComponent} from './modules/user/account/login/confirm-account/confirm-account.component';
import {ProfileAuthorizationGuard} from "./common/guard/profileAuthorizationGuard";
import {JwtInterceptor} from "./common/interceptor/jwt.interceptor";
import {LostPasswordComponent} from './modules/user/account/login/lost-password/lost-password.component';
import {
  SkillLevelSelectComponent
} from './modules/user/build-calculator/skill-level-select/skill-level-select.component';
import {AdminComponent} from './layouts/admin/admin.component';
import {SkillsComponent} from './modules/admin/skills/skills.component';
import {AdminAuthorizationGuard} from "./common/guard/adminAuthorizationGuard";
import {SkillUpdateComponent} from './modules/admin/skills/skill-update/skill-update.component';
import {MatTabsModule} from "@angular/material/tabs";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {MatTreeModule} from "@angular/material/tree";
import {MatExpansionModule} from "@angular/material/expansion";
import {BuildsListComponent} from './modules/user/build-calculator/builds-list/builds-list.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {DrifSimulatorComponent} from './modules/user/drif-simulator/drif-simulator.component';
import {ImportantModsComponent} from './modules/user/tips/important-mods/important-mods.component';
import {DrifSelectComponent} from './modules/user/drif-simulator/drif-select/drif-select.component';
import {NgOptimizedImage, registerLocaleData} from "@angular/common";
import localePl from '@angular/common/locales/pl'
import localePlExtra from '@angular/common/locales/extra/pl';
import {PostsComponent} from './modules/admin/posts/posts.component';
import {PostAddComponent} from './modules/admin/posts/post-add/post-add.component';
import {PostEditComponent} from './modules/admin/posts/post-edit/post-edit.component'
import {SimpleDate} from "./common/pipe/simple-date";
import {PostComponent} from './modules/user/post/post.component';
import {CategoryComponent} from './modules/user/category/category.component';
import {NoSanitize} from "./common/pipe/no-sanitize";
import {CategoryAddComponent} from './modules/admin/category/category-add/category-add.component';
import {CategoryUpdateComponent} from './modules/admin/category/category-update/category-update.component';
import {AdminCategoryComponent} from "./modules/admin/category/admin-category.component";
import {PrivacyPolicyComponent} from './modules/user/privacy-policy/privacy-policy.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTooltipModule} from "@angular/material/tooltip";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {UpgradeSimulatorComponent} from './modules/user/upgrade-simulator/upgrade-simulator.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AdsenseModule} from "ng2-adsense";
import {InventoryComponent} from './modules/admin/inventory/inventory.component';
import {UpdateRarComponent} from './modules/admin/inventory/update-rar/update-rar.component';
import {CreateRarComponent} from "./modules/admin/inventory/create-rar/create-rar.component";
import {MonsterComponent} from './modules/admin/monster/monster.component';
import {MonsterAddComponent} from './modules/admin/monster/monster-add/monster-add.component';
import {MonsterUpdateComponent} from './modules/admin/monster/monster-update/monster-update.component';
import {RarListComponent} from './modules/user/rar-list/rar-list.component';
import {MatSliderModule} from "@angular/material/slider";
import {SuggestionsComponent} from './modules/admin/suggestions/suggestions.component';
import {UserSuggestionComponent} from './modules/user/user-suggestion/user-suggestion.component';
import {ItemComparatorComponent} from './modules/user/rar-list/item-comparator/item-comparator.component';
import {MatSortModule} from "@angular/material/sort";
import {EditAdminCommentComponent} from './modules/admin/suggestions/edit-admin-comment/edit-admin-comment.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatMenuModule} from "@angular/material/menu";
import {Underscore} from "./common/pipe/underscore";
import {OrbsTableComponent} from './modules/user/orbs-table/orbs-table.component';
import {NgVarDirective} from "./common/directive/ng-var.directive";
import {DrifsComponent} from './modules/admin/drifs/drifs.component';
import {OrbsComponent} from './modules/admin/orbs/orbs.component';
import {OverlayModule} from "@angular/cdk/overlay";
import {ArabianPipe} from './common/pipe/arabian.pipe';
import {DrifSumDialogComponent} from './modules/user/build-calculator/drif-sum-dialog/drif-sum-dialog.component';


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

@NgModule({
  declarations: [
    AppComponent,
    BrokencalcComponent,
    HomeComponent,
    InfoDialogComponent,
    FooterComponent,
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
    DrifSumDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatGridListModule,
    MatBadgeModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatTableModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    ReactiveFormsModule,
    MatTabsModule,
    AngularEditorModule,
    MatTreeModule,
    MatExpansionModule,
    MatPaginatorModule,
    NgOptimizedImage,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DragDropModule,
    MatRadioModule,
    MatCheckboxModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-8605997221846310',
      adSlot: 7391443546,
    }),
    MatSliderModule,
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
    MatMenuModule,
    OverlayModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    ProfileAuthorizationGuard,
    AdminAuthorizationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

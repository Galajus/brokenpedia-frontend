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
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ConfirmAccountComponent } from './modules/user/account/login/confirm-account/confirm-account.component';
import {ProfileAuthorizationGuard} from "./common/guard/profileAuthorizationGuard";
import {JwtInterceptor} from "./common/interceptor/jwt.interceptor";
import { LostPasswordComponent } from './modules/user/account/login/lost-password/lost-password.component';
import { SkillLevelSelectComponent } from './modules/user/build-calculator/skill-level-select/skill-level-select.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { SkillsComponent } from './modules/admin/skills/skills.component';
import {AdminAuthorizationGuard} from "./common/guard/adminAuthorizationGuard";


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
    SkillsComponent
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
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    ProfileAuthorizationGuard,
    AdminAuthorizationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

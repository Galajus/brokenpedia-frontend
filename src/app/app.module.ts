import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {BrokencalcComponent} from './custom-pages/build-calculator/brokencalc.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatBadgeModule} from "@angular/material/badge";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {HomeComponent} from './home/home.component';
import {FormsModule} from "@angular/forms";
import {InfoDialogComponent} from './custom-pages/build-calculator/info-dialog/info-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {FooterComponent} from './shared/components/footer/footer.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {DefaultComponent} from './layouts/default/default.component';
import {LoginComponent} from './account/login/login.component';
import {DashboardComponent} from './account/dashboard/dashboard.component';
import {DiscordApiRedirectComponent} from './account/login/discord-api-redirect/discord-api-redirect.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {DiscordAuthComponent} from './account/login/auth/discord/discord-auth.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrokenHelperComponent} from './custom-pages/broken-helper/broken-helper.component';
import {EssenceCalculatorComponent} from './custom-pages/essence-calculator/essence-calculator.component';
import {MatTableModule} from "@angular/material/table";
import {PsychoExpCalculatorComponent} from './custom-pages/psycho-exp-calculator/psycho-exp-calculator.component';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from "ngx-cookieconsent";
import {TestsComponent} from './custom-pages/tests/tests.component';


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
    DiscordApiRedirectComponent,
    PageNotFoundComponent,
    DiscordAuthComponent,
    BrokenHelperComponent,
    EssenceCalculatorComponent,
    PsychoExpCalculatorComponent,
    TestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

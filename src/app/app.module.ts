import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalculatorComponent } from './calculator/calculator.component';
import {MatButtonModule} from "@angular/material/button";
import { BrokencalcComponent } from './brokencalc/brokencalc.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatBadgeModule} from "@angular/material/badge";

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    BrokencalcComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatGridListModule,
        MatBadgeModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

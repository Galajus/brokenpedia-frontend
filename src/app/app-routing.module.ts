import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CalculatorComponent} from "./calculator/calculator.component";
import {BrokencalcComponent} from "./brokencalc/brokencalc.component";
import {HomeComponent} from "./home/home.component";
import {DefaultComponent} from "./layouts/default/default.component";

const routes: Routes = [

  {
    path:'', component: DefaultComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'br', component: BrokencalcComponent },
      { path: 'build-calculator', component: BrokencalcComponent }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

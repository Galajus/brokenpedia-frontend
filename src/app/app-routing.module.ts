import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CalculatorComponent} from "./calculator/calculator.component";
import {BrokencalcComponent} from "./brokencalc/brokencalc.component";

const routes: Routes = [
  { path: 'calculator', component: CalculatorComponent },
  { path: 'br', component: BrokencalcComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

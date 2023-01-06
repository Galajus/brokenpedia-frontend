import { Component, OnInit } from '@angular/core';
import {TileSkill} from "./model/tile";

@Component({
  selector: 'app-brokencalc',
  templateUrl: './brokencalc.component.html',
  styleUrls: ['./brokencalc.component.scss']
})
export class BrokencalcComponent implements OnInit {

  tilesTop: TileSkill[] = [
    {text: 'Rozprucie', image: "bb1", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'Wirujące ostrze', image: "bb2", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'Furia', image: "bb3", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'Dyńka', image: "bb4", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'Gruboskórność', image: "bb5", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'Krytyczne uderzenie', image: "bb6", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'Taran', image: "bb7", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'Fala gniewu', image: "bb8", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'Amok', image: "bb9", cols: 2, rows: 1, color: 'rgba(0,0,0,0)'},
  ];

  tilesBottom: TileSkill[] = [
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'down', image: "skilldown", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
    {text: 'up', image: "skillup", cols: 1, rows: 1, color: 'rgba(0,0,0,0)'},
  ];
  constructor() { }

  ngOnInit(): void {
  }

}

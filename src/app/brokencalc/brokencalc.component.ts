import { Component, OnInit } from '@angular/core';
import {Skill} from "./model/skill";
import * as events from "events";

@Component({
  selector: 'app-brokencalc',
  templateUrl: './brokencalc.component.html',
  styleUrls: ['./brokencalc.component.scss']
})
export class BrokencalcComponent implements OnInit {

  level: number = 140;
  points: number = 0;
  studentPoints: number = 2;
  adeptPoints: number = 11;
  masterPoints: number = 13;
  skills: Skill[] = [
    {level: 0, text: 'Rozprucie', image: "bb1", id: 1},
    {level: 0, text: 'Wirujące ostrze', image: "bb2", id: 2},
    {level: 0, text: 'Furia', image: "bb3", id: 3},
    {level: 0, text: 'Dyńka', image: "bb4", id: 4},
    {level: 0, text: 'Gruboskórność', image: "bb5", id: 5},
    {level: 0, text: 'Krytyczne uderzenie', image: "bb6", id: 6},
    {level: 0, text: 'Taran', image: "bb7", id: 7},
    {level: 0, text: 'Fala gniewu', image: "bb8", id: 8},
    {level: 0, text: 'Amok', image: "bb9", id: 9},
  ];
  constructor() { }

  ngOnInit(): void {
    this.calculatePoints();
  }

  calculatePoints() {
    if (this.level == 1) {
      this.points = 0;
      this.masterPoints = 0;
      this.adeptPoints = 0;
      this.studentPoints = 0;
      return;
    }
    this.points = (this.level * ((this.level + 1)) / 2) - 1;

    this.masterPoints = Math.floor(this.points / 196);
    this.adeptPoints = Math.floor((this.points - (this.masterPoints * 196)) / 14);
    this.studentPoints = Math.floor((this.points - (this.masterPoints * 196 + this.adeptPoints * 14)));
    console.log(this.points)
  }

  test(upgrade: boolean, skill: string) {
    if (upgrade) {
      console.log("upgrade: " + skill)
      this.masterPoints++;
    } else {
      console.log("downgrade: " + skill)
      this.masterPoints--;
    }

    this.skills.find(skill => skill.id == 1)!.image;

  }

  updateLevelById(upgrade: boolean, id: number) {
    if (upgrade) {
    this.skills.find(skill => skill.id == id)!.level++;
    } else {
      this.skills.find(skill => skill.id == id)!.level--;
    }
  }
}

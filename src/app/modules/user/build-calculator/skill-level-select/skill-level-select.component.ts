import {Component, OnInit} from '@angular/core';
import {BuildCalculatorService} from "../build-calculator.service";

@Component({
  selector: 'app-skill-level-select',
  templateUrl: './skill-level-select.component.html',
  styleUrls: ['./skill-level-select.component.scss']
})
export class SkillLevelSelectComponent implements OnInit {

  levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  constructor(
    private buildCalculatorService: BuildCalculatorService
  ) { }

  ngOnInit(): void {
  }

  pushLevel(lvl: number) {
    this.buildCalculatorService.showSkillDataBySelectedLevel(lvl);
  }

  getLevelString(level: number) {
    return this.buildCalculatorService.getLevelString(level);
  }

}

import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Skill} from "./model/skill";
import {SkillCost} from "./model/skillCost";
import {MatDialog} from "@angular/material/dialog";
import {InfoDialogComponent} from "./info-dialog/info-dialog.component";
import {Statistic} from "./model/statistic";
import {Build} from "./model/build";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BuildCalculatorService} from "./build-calculator.service";
import {SkillBasic} from "./model/skillBasic";
import {SkillLevelSelectComponent} from "./skill-level-select/skill-level-select.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-brokencalc',
  templateUrl: './brokencalc.component.html',
  styleUrls: ['./brokencalc.component.scss']
})
export class BrokencalcComponent implements OnInit, OnDestroy {
  /*bbClassSkills: Skill[] = [
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Rozprucie', image: "bb1", id: 10, beginLevel: 2},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Wirujące ostrze', image: "bb2", id: 11, beginLevel: 5},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Furia', image: "bb3", id: 12, beginLevel: 8},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Dyńka', image: "bb4", id: 13, beginLevel: 11},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Gruboskórność', image: "bb5", id: 14, beginLevel: 14},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Krytyczne uderzenie', image: "bb6", id: 15, beginLevel: 17},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Taran', image: "bb7", id: 16, beginLevel: 20},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Fala gniewu', image: "bb8", id: 17, beginLevel: 23},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Amok', image: "bb9", id: 18, beginLevel: 26},
  ];

  fmClassSkills: Skill[] = [
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Rozprucie', image: "mo1", id: 20, beginLevel: 2},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Wirujące ostrze', image: "mo2", id: 21, beginLevel: 5},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Furia', image: "mo3", id: 22, beginLevel: 8},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Dyńka', image: "mo4", id: 23, beginLevel: 11},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Gruboskórność', image: "mo5", id: 24, beginLevel: 14},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Krytyczne uderzenie', image: "mo6", id: 25, beginLevel: 17},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Taran', image: "mo7", id: 26, beginLevel: 20},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Fala gniewu', image: "mo8", id: 27, beginLevel: 23},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Amok', image: "mo9", id: 28, beginLevel: 26},
  ];

  knClassSkills: Skill[] = [
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Rozprucie', image: "kn1", id: 30, beginLevel: 2},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Wirujące ostrze', image: "kn2", id: 31, beginLevel: 5},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Furia', image: "kn3", id: 32, beginLevel: 8},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Dyńka', image: "kn4", id: 33, beginLevel: 11},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Gruboskórność', image: "kn5", id: 34, beginLevel: 14},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Krytyczne uderzenie', image: "kn6", id: 35, beginLevel: 17},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Taran', image: "kn7", id: 36, beginLevel: 20},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Fala gniewu', image: "kn8", id: 37, beginLevel: 23},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Amok', image: "kn9", id: 38, beginLevel: 26},
  ];

  drClassSkills: Skill[] = [
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Rozprucie', image: "dr1", id: 40, beginLevel: 2},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Wirujące ostrze', image: "dr2", id: 41, beginLevel: 5},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Furia', image: "dr3", id: 42, beginLevel: 8},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Dyńka', image: "dr4", id: 43, beginLevel: 11},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Gruboskórność', image: "dr5", id: 44, beginLevel: 14},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Krytyczne uderzenie', image: "dr6", id: 45, beginLevel: 17},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Taran', image: "dr7", id: 46, beginLevel: 20},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Fala gniewu', image: "dr8", id: 47, beginLevel: 23},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Amok', image: "dr9", id: 48, beginLevel: 26},
  ];

  shClassSkills: Skill[] = [
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Rozprucie', image: "sh1", id: 50, beginLevel: 2},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Wirujące ostrze', image: "sh2", id: 51, beginLevel: 5},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Furia', image: "sh3", id: 52, beginLevel: 8},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Dyńka', image: "sh4", id: 53, beginLevel: 11},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Gruboskórność', image: "sh5", id: 54, beginLevel: 14},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Krytyczne uderzenie', image: "sh6", id: 55, beginLevel: 17},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Taran', image: "sh7", id: 56, beginLevel: 20},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Fala gniewu', image: "sh8", id: 57, beginLevel: 23},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Amok', image: "sh9", id: 58, beginLevel: 26},
  ];

  arClassSkills: Skill[] = [
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Rozprucie', image: "uk1", id: 60, beginLevel: 2},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Wirujące ostrze', image: "uk2", id: 61, beginLevel: 5},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Furia', image: "uk3", id: 62, beginLevel: 8},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Dyńka', image: "uk4", id: 63, beginLevel: 11},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Gruboskórność', image: "uk5", id: 64, beginLevel: 14},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Krytyczne uderzenie', image: "uk6", id: 65, beginLevel: 17},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Taran', image: "uk7", id: 66, beginLevel: 20},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Fala gniewu', image: "uk8", id: 67, beginLevel: 23},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Amok', image: "uk9", id: 68, beginLevel: 26},
  ];

  vdClassSkills: Skill[] = [
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Rozprucie', image: "vd1", id: 70, beginLevel: 2},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Wirujące ostrze', image: "vd2", id: 71, beginLevel: 5},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Furia', image: "vd3", id: 72, beginLevel: 8},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Dyńka', image: "vd4", id: 73, beginLevel: 11},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Gruboskórność', image: "vd5", id: 74, beginLevel: 14},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Krytyczne uderzenie', image: "vd6", id: 75, beginLevel: 17},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Taran', image: "vd7", id: 76, beginLevel: 20},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Fala gniewu', image: "vd8", id: 77, beginLevel: 23},
    {level: 0, maxLevel: 21, minLevel: 0, name: 'Amok', image: "vd9", id: 78, beginLevel: 26},
  ];

  basicSkillsTemplate: Skill[] = [
    {level: 1, maxLevel: 21, minLevel: 1, name: 'Cios pięścią', image: "b1", id: 1, beginLevel: 1},
    {level: 1, maxLevel: 21, minLevel: 1, name: 'Okrzyk bojowy', image: "b2", id: 2, beginLevel: 1},
    {level: 1, maxLevel: 21, minLevel: 1, name: 'Rzut kamieniem', image: "b3", id: 3, beginLevel: 1},
    {level: 1, maxLevel: 21, minLevel: 1, name: 'Strzał', image: "b4", id: 4, beginLevel: 1},
    {level: 1, maxLevel: 21, minLevel: 1, name: 'Zwykły atak', image: "b5", id: 5, beginLevel: 1},
    {level: 1, maxLevel: 1, minLevel: 1, name: 'Wyrwanie z korzeni', image: "b6", id: 6, beginLevel: 1},
    {level: 1, maxLevel: 1, minLevel: 1, name: 'Ucieczka', image: "b7", id: 7, beginLevel: 1},
    {level: 0, maxLevel: 14, minLevel: 0, name: 'Wataha', image: "b8", id: 8, beginLevel: 35},
  ]*/

  /*statsTemplate: Statistic[] = [
    {name: "Zdrowie", image: "health", level: 20, minLevel: 20, id: 1},
    {name: "Mana", image: "mana", level: 20, minLevel: 20, id: 2},
    {name: "Kondycja", image: "stamina", level: 20, minLevel: 20, id: 3},
    {name: "Siła", image: "strength", level: 10, minLevel: 10, id: 4},
    {name: "Zręczność", image: "dexterity", level: 10, minLevel: 10, id: 5},
    {name: "Moc", image: "power", level: 10, minLevel: 10, id: 6},
    {name: "Wiedza", image: "knowledge", level: 10, minLevel: 10, id: 7},
  ]*/

  /*skillCosts: SkillCost[] = [
    {id: 1, level: 0, singleCost: 0, sumCost: 0},
    {id: 2, level: 1, singleCost: 1, sumCost: 1},
    {id: 3, level: 2, singleCost: 2, sumCost: 3},
    {id: 4, level: 3, singleCost: 3, sumCost: 6},
    {id: 5, level: 4, singleCost: 4, sumCost: 10},
    {id: 6, level: 5, singleCost: 5, sumCost: 15},
    {id: 7, level: 6, singleCost: 6, sumCost: 21},
    {id: 8, level: 7, singleCost: 7, sumCost: 28},
    {id: 9, level: 8, singleCost: 14, sumCost: 42},
    {id: 10, level: 9, singleCost: 28, sumCost: 70},
    {id: 11, level: 10, singleCost: 42, sumCost: 112},
    {id: 12, level: 11, singleCost: 56, sumCost: 168},
    {id: 13, level: 12, singleCost: 70, sumCost: 238},
    {id: 14, level: 13, singleCost: 84, sumCost: 322},
    {id: 15, level: 14, singleCost: 98, sumCost: 420},
    {id: 16, level: 15, singleCost: 196, sumCost: 616},
    {id: 17, level: 16, singleCost: 392, sumCost: 1008},
    {id: 18, level: 17, singleCost: 588, sumCost: 1596},
    {id: 19, level: 18, singleCost: 784, sumCost: 2380},
    {id: 20, level: 19, singleCost: 980, sumCost: 3360},
    {id: 21, level: 20, singleCost: 1176, sumCost: 4536},
    {id: 22, level: 21, singleCost: 1372, sumCost: 5908}
  ]*/

  bbClassSkills: Skill[] = [];
  fmClassSkills: Skill[] = [];
  knClassSkills: Skill[] = [];
  drClassSkills: Skill[] = [];
  shClassSkills: Skill[] = [];
  vdClassSkills: Skill[] = [];
  arClassSkills: Skill[] = [];
  basicSkillsTemplate: Skill[] = [];
  statsTemplate: Statistic[] = [];
  skillCosts: SkillCost[] = [];

  build: Build = {
    level: 0,
    currentClass: "bb",
    currentBasicSkills: [],
    currentClassSkills: [],
    currentStatistics: []
  };

  currentBasicSkills: Skill[] = [];
  currentClassSkills: Skill[] = [];
  currentStats: Statistic[] = [];
  resetOnLevelChange: boolean = false;
  newLevel: string = "2";
  newClass: string = "bb";
  level: number = 2;
  skillPoints: number = 0;
  remainingSkillPoints: number = 0;
  studentPoints: number = 0;
  adeptPoints: number = 0;
  masterPoints: number = 0;
  statPoints: number = 0;
  remainingStatsPoints: number = 0;
  activeSkillImageName: string = "bb1";
  activeSkill!: Skill;

  technicalRefresh: boolean = false;
  subscription!: Subscription;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private buildCalculatorService: BuildCalculatorService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.buildCalculatorService.subject
      .subscribe(newLevel => this.activeSkill.level = newLevel);
    this.prepareData();
  }

  ngOnDestroy() {
    this.saveBuild();
    this.subscription.unsubscribe();
  }

  prepareData() {
    this.buildCalculatorService.getInitData()
      .subscribe(data => {
        this.statsTemplate = data.defaultStatistics;
        this.skillCosts = data.skillCosts;
        this.assignClassSkills(data.classSkills);
        this.loadBuild();
      })
  }

  assignClassSkills(skills: Skill[]) {
    skills.forEach(skill => {
      switch (skill.profession) {
        case "DEFAULT":
          this.basicSkillsTemplate.push(skill);
          break;
        case "BARBARIAN":
          this.bbClassSkills.push(skill);
          break;
        case "FIRE_MAGE":
          this.fmClassSkills.push(skill);
          break;
        case "KNIGHT":
          this.knClassSkills.push(skill);
          break;
        case "DRUID":
          this.drClassSkills.push(skill);
          break;
        case "SHEED":
          this.shClassSkills.push(skill);
          break;
        case "ARCHER":
          this.arClassSkills.push(skill);
          break;
        case "VOODOO":
          this.vdClassSkills.push(skill);
          break;
        default:
          console.log("ERROR");
      }
    })
  }

  calculatePoints() {
    if (this.level > 140) {
      this.level = 140;
      this.newLevel = "140";
    }

    if (this.level <= 1) {
      this.level = 1;
      this.newLevel = "1";
    }

    //CALCULATE STATS POINTS
    this.updateStatPoints();

    //CALCULATE SKILL POINTS
    this.skillPoints = (this.level * ((this.level + 1)) / 2) - 1;

    let spentPoints = 0;
    this.currentClassSkills.forEach(skill => {
      spentPoints += this.skillCosts.find(cost => cost.level == skill.level)!.sumCost;
    })
    this.currentBasicSkills.forEach(skill => {
      if (skill.level != skill.minLevel) {
        if (skill.minLevel != 0) {
          spentPoints += this.skillCosts.find(cost => cost.level == skill.level)!.sumCost - 1;
        } else {
          spentPoints += this.skillCosts.find(cost => cost.level == skill.level)!.sumCost;
        }
      }
    })

    this.remainingSkillPoints = this.skillPoints - spentPoints;

    this.masterPoints = Math.floor(this.remainingSkillPoints / 196);
    this.adeptPoints = Math.floor((this.remainingSkillPoints - (this.masterPoints * 196)) / 14);
    this.studentPoints = Math.floor((this.remainingSkillPoints - (this.masterPoints * 196 + this.adeptPoints * 14)));
  }

  private updateStatPoints() {
    this.statPoints = this.level * 4 + 1;

    let spentStatPoints = 0;
    this.currentStats.forEach(stat => {
      spentStatPoints += stat.level - stat.minLevel;
    })

    this.remainingStatsPoints = this.statPoints - spentStatPoints;
  }

  updateStatById(upgrade: boolean, amount: number, id: number) {
    let targetStat = this.currentStats.find(stat => stat.id == id);
    if (targetStat == null) {
      this.snackBar.open("Wystąpił błąd - zgłoś go proszę!", "ok!", {duration: 3000});
      return;
    }

    if (upgrade) {
      if (this.remainingStatsPoints >= amount) {
        targetStat.level += amount;
      } else {
        let validNumber = targetStat.level + this.remainingStatsPoints;
        if (validNumber >= targetStat.minLevel) {
          if (this.remainingStatsPoints < 0 && targetStat.level != targetStat.minLevel) {
            this.snackBar.open("Nadmiarowo rozdane statystyki zostały usunięte", "ok!", {duration: 3000});
          }
          targetStat.level += this.remainingStatsPoints;
        } else {
          targetStat.level = targetStat.minLevel;
        }

      }
    } else {
      let newLevel = targetStat.level - amount;
      if (newLevel >= targetStat.minLevel) {
        targetStat.level = newLevel;
      } else {
        targetStat.level = targetStat.minLevel;
        this.snackBar.open("Ta statystyka jest już na minimalnym poziomie", "ok!", {duration: 3000});
      }
    }
    this.calculatePoints();
  }

  updateLevelById(upgrade: boolean, id: number) {
    let isBasicSkill: boolean = false;
    let targetSkill = this.currentClassSkills.find(skill => skill.id == id);
    if (targetSkill == null) {
      targetSkill = this.currentBasicSkills.find(skill => skill.id == id);
      isBasicSkill = true;
    }
    if (targetSkill == null) {
      this.snackBar.open("Wystąpił błąd - zgłoś go proszę!", "ok!", {duration: 3000});
      return;
    }
    if (upgrade) {
      if (targetSkill.level == targetSkill.maxLevel) {
        this.snackBar.open("Ten skill ma już maksymalny poziom", "ok!", {duration: 3000});
        return;
      }

      let requiredLevel: number;
      if (isBasicSkill) {
        if (targetSkill.beginLevel == 35) {
          //Pack skill
          requiredLevel = (targetSkill.level * 5) + 35;

        } else {
          requiredLevel = targetSkill.level + 1;
        }
      } else {
        //Class skills
        requiredLevel = targetSkill.level + targetSkill.beginLevel;
      }

      if (Number.isNaN(requiredLevel)) {
        localStorage.removeItem("build");
        this.snackBar.open("BŁĄD PO AKTUALIZACJI - ODŚWIEŻ STRONĘ!", "ok!", {duration: 5000});
        this.technicalRefresh = true;
        return;
      }

      if (this.level < requiredLevel) {
        this.snackBar.open("Masz zbyt niski poziom postaci, wymagany: " + requiredLevel, "ok!", {duration: 3000});
        return;
      }

      let upgradeCost: number = this.skillCosts.find(cost => cost.level == targetSkill!.level + 1)!.singleCost;
      if (upgradeCost > this.remainingSkillPoints) {
        this.snackBar.open("Za mało punktów na ulepszenie", "ok!", {duration: 3000});
        return;
      }
      targetSkill.level++;

    } else {
      if (targetSkill.level == targetSkill.minLevel) {
        this.snackBar.open("Ten skill jest już na minimalnym poziomie", "ok!", {duration: 3000});
        return;
      }
      targetSkill.level--;
    }
    this.calculatePoints();
  }

  levelUpdate() {
    let number = parseInt(this.newLevel);
    if (!Number.isNaN(number)) {
      this.level = number;
      this.calculatePoints();
      if (this.resetOnLevelChange) {
        this.classUpdate(this.newClass)
      }
    }
  }

  classUpdate(value: string) {
    switch (value) {
      case "bb": {
        this.rewriteCurrentClassSkills(this.bbClassSkills);
        break;
      }
      case "fm": {
        this.rewriteCurrentClassSkills(this.fmClassSkills);
        break;
      }
      case "dr": {
        this.rewriteCurrentClassSkills(this.drClassSkills);
        break;
      }
      case "kn": {
        this.rewriteCurrentClassSkills(this.knClassSkills);
        break;
      }
      case "ar": {
        this.rewriteCurrentClassSkills(this.arClassSkills);
        break;
      }
      case "sh": {
        this.rewriteCurrentClassSkills(this.shClassSkills);
        break;
      }
      case "vd": {
        this.rewriteCurrentClassSkills(this.vdClassSkills);
        break;
      }
    }
  }

  rewriteCurrentClassSkills(skills: Skill[]) {
    this.currentClassSkills = [];
    this.currentStats = [];
    this.currentBasicSkills = [];
    skills.forEach(val => this.currentClassSkills.push(Object.assign({}, val)));
    this.basicSkillsTemplate.forEach(value => this.currentBasicSkills.push(Object.assign({}, value)));
    this.statsTemplate.forEach(value => this.currentStats.push(Object.assign({}, value)));
    this.calculatePoints();
  }

  getLevelStyle(level: number): String {
    if (level <= 7) {
      return "student";
    }
    if (level > 7 && level <= 14) {
      return "adept";
    }
    return "master";
  }

  getPrettyLevel(level: number) {
    if (level <= 7) {
      return level;
    }
    if (level > 7 && level <= 14) {
      return level - 7;
    }
    return level - 14;
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(InfoDialogComponent, {
      width: '450px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  private saveBuild() {
    if (this.technicalRefresh) {
      return;
    }
    if (this.build != null &&
      this.build.currentStatistics &&
      this.build.currentBasicSkills &&
      this.build.currentClassSkills &&
      this.build.currentStatistics.length != 0 &&
      this.build.currentBasicSkills.length != 0 &&
      this.build.currentClassSkills.length != 0 &&
      this.build.currentClass) {
      return;
    }

    this.build.level = this.level;
    this.build.currentClass = this.newClass;
    this.build.currentClassSkills = this.currentClassSkills;
    this.build.currentBasicSkills = this.currentBasicSkills;
    this.build.currentStatistics = this.currentStats;
    localStorage.setItem("build", JSON.stringify(this.build, function replacer(key, value) {
      return value
    }));
  }

  private loadBuild() {
    let data = localStorage.getItem('build');
    if (data == null) {
      this.rewriteCurrentClassSkills(this.bbClassSkills);
      return;
    }
    let build: Build = JSON.parse(data);
    if (build != null &&
      build.currentStatistics &&
      build.currentBasicSkills &&
      build.currentClassSkills &&
      build.currentStatistics.length != 0 &&
      build.currentBasicSkills.length != 0 &&
      build.currentClassSkills.length != 0 &&
      build.currentClass) {
      this.level = build.level;
      this.newLevel = this.level.toString();
      this.newClass = build.currentClass;
      this.currentStats = build.currentStatistics;
      this.currentClassSkills = build.currentClassSkills;
      this.currentBasicSkills = build.currentBasicSkills;
      this.calculatePoints();
      return;
    }
    this.rewriteCurrentClassSkills(this.bbClassSkills);
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveBuild();
  }

  setCurrentActive(image: string) {
    this.activeSkillImageName = image;
    this.updateDescription();
  }

  updateDescription() {
    this.activeSkill = structuredClone(this.currentClassSkills.filter(s => s.image === this.activeSkillImageName)[0]);
    if (!this.activeSkill) {
      this.activeSkill = structuredClone(this.currentBasicSkills.filter(s => s.image === this.activeSkillImageName)[0]);
    }
  }

  getActiveSkillBasic(level: number): SkillBasic {
    if (level - 1 < 0) {
      level = 1;
    }
    return this.activeSkill.skillBasics[level - 1];
  }

  getLevelString(level: number) {
    return this.buildCalculatorService.getLevelString(level);
  }

  openSkillLevelSelectDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SkillLevelSelectComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

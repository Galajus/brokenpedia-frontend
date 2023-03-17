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
import {SimpleBuild} from "./model/simpleBuild";
import {BuildSkillStatData} from "./model/buildSkillStatData";
import {SkillStatType} from "./model/skillStatType";

@Component({
  selector: 'app-brokencalc',
  templateUrl: './brokencalc.component.html',
  styleUrls: ['./brokencalc.component.scss']
})
export class BrokencalcComponent implements OnInit, OnDestroy {

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
    currentClass: "BARBARIAN",
    currentBasicSkills: [],
    currentClassSkills: [],
    currentStatistics: []
  };

  currentBasicSkills: Skill[] = [];
  currentClassSkills: Skill[] = [];
  currentStats: Statistic[] = [];
  resetOnLevelChange: boolean = false;
  newLevel: string = "2";
  newClass: string = "BARBARIAN";
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
    //this.saveBuild();
    this.saveSimpleBuild();
    this.subscription.unsubscribe();
  }

  prepareData() {
    this.buildCalculatorService.getInitData()
      .subscribe(data => {
        this.statsTemplate = data.defaultStatistics;
        this.skillCosts = data.skillCosts;
        this.assignClassSkills(data.classSkills);
        //this.loadBuild();
        this.loadSimpleBuild();
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
      case "BARBARIAN": {
        this.rewriteCurrentClassSkills(this.bbClassSkills);
        break;
      }
      case "FIRE_MAGE": {
        this.rewriteCurrentClassSkills(this.fmClassSkills);
        break;
      }
      case "DRUID": {
        this.rewriteCurrentClassSkills(this.drClassSkills);
        break;
      }
      case "KNIGHT": {
        this.rewriteCurrentClassSkills(this.knClassSkills);
        break;
      }
      case "ARCHER": {
        this.rewriteCurrentClassSkills(this.arClassSkills);
        break;
      }
      case "SHEED": {
        this.rewriteCurrentClassSkills(this.shClassSkills);
        break;
      }
      case "VOODOO": {
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

  private saveSimpleBuild() {
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
    let stats = this.currentStats.map(stat => {
      let x: BuildSkillStatData = {
        id: stat.id,
        level: stat.level,
        skillStatType: SkillStatType.STAT
      }
      return x;
    });
    let basicsSkills = this.currentBasicSkills.map(basic => {
      let x: BuildSkillStatData = {
        id: basic.id,
        level: basic.level,
        skillStatType: SkillStatType.BASIC_SKILL
      }
      return x;
    });
    let classSkills = this.currentClassSkills.map(clas => {
      let x: BuildSkillStatData = {
        id: clas.id,
        level: clas.level,
        skillStatType: SkillStatType.CLASS_SKILL
      }
      return x;
    });

    let buildSkillStatData = stats.concat(basicsSkills, classSkills);
    let build: SimpleBuild = {
      id: 0,
      buildId: 0,
      profession: this.newClass,
      level: this.level,
      skillStatData: buildSkillStatData,
    }
    localStorage.setItem("simple-build", JSON.stringify(build, function replacer(key, value) {
        return value;
    }));
  }

  private loadSimpleBuild() {
    let data = localStorage.getItem('simple-build');
    if (data == null) {
      console.log("build not saved");
      this.rewriteCurrentClassSkills(this.bbClassSkills);
      return;
    }
    let build: SimpleBuild = JSON.parse(data)

    if (!build) {
      console.log("build null");
      this.rewriteCurrentClassSkills(this.bbClassSkills);
      return;
    }

    this.classUpdate(build.profession);
    this.level = build.level;
    this.newLevel = build.level.toString();
    this.newClass = build.profession;
    build.skillStatData.forEach(data => {
      if (data.skillStatType == SkillStatType.STAT) {
          let stat = this.currentStats.find(s => s.id == data.id);
          if (stat) {
            stat.level = data.level;
          }
          return;
        }
      if (data.skillStatType == SkillStatType.BASIC_SKILL) {
          let stat = this.currentBasicSkills.find(s => s.id == data.id);
          if (stat) {
            stat.level = data.level;
          }
        return;
        }
      if (data.skillStatType == SkillStatType.CLASS_SKILL) {
          let stat = this.currentClassSkills.find(s => s.id == data.id);
          if (stat) {
            stat.level = data.level;
          }
        return;
        }
    });

    this.calculatePoints();
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    //this.saveBuild();
    this.saveSimpleBuild();
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


  /*private loadBuild() {
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
  }*/

  /*private saveBuild() {
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
  }*/
}

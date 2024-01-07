import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CalculationResult} from "../../../models/upgrade-simulator/calculationResult";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {WorkerData} from "../../../models/upgrade-simulator/workerData";
import {WorkerResponse} from "../../../models/upgrade-simulator/workerResponse";
import {CustomNumberInputService} from "../../../services/common/custom-number-input.service";

@Component({
  selector: 'app-upgrade-simulator',
  templateUrl: './upgrade-simulator.component.html',
  styleUrls: ['./upgrade-simulator.component.scss']
})
export class UpgradeSimulatorComponent implements OnInit, OnDestroy {

  @ViewChild('durability') durabilityInput!: HTMLInputElement;

  rankPrices: any[] = [
    {
      rank: 1,
      inhiPrice: 3,
      rollPrice: 500,
      flaskSize: 1
    },
    {
      rank: 2,
      inhiPrice: 4,
      rollPrice: 1500,
      flaskSize: 1
    },
    {
      rank: 3,
      inhiPrice: 4,
      rollPrice: 2500,
      flaskSize: 1
    },
    {
      rank: 4,
      inhiPrice: 5,
      rollPrice: 10000,
      flaskSize: 2
    },
    {
      rank: 5,
      inhiPrice: 6,
      rollPrice: 15000,
      flaskSize: 2
    },
    {
      rank: 6,
      inhiPrice: 6,
      rollPrice: 25000,
      flaskSize: 2
    },
    {
      rank: 7,
      inhiPrice: 7,
      rollPrice: 35000,
      flaskSize: 3
    },
    {
      rank: 8,
      inhiPrice: 8,
      rollPrice: 50000,
      flaskSize: 3
    },
    {
      rank: 9,
      inhiPrice: 8,
      rollPrice: 65000,
      flaskSize: 3
    },
    {
      rank: 10,
      inhiPrice: 10,
      rollPrice: 100000,
      flaskSize: 4
    },
    {
      rank: 11,
      inhiPrice: 12,
      rollPrice: 200000,
      flaskSize: 4
    },
    {
      rank: 12,
      inhiPrice: 12,
      rollPrice: 300000,
      flaskSize: 4
    }
  ]

  userUpgradeChoices: any[] = [];
  targetLevel: string = "5";
  itemDurability: string = "45";
  itemRank: number = 10;
  platinumPrice: string = "8 000";
  essencePrice: string = "25 000";
  flaskPrice: string = "40 000";
  reolPrice: string = "200 000";
  dviggPrice: string = "60 000";
  rollsAmount: string = "1";
  //maxCosts: number = 0;
  rollAmountWork: number = 0;
  cumulateRolls: boolean = true; //TODO: Clear on change target, prices etc.
  continueIngredients: boolean = true;

  currentWorker!: Worker;
  workerStage: Number = 0;
  isWorking: boolean = false;
  workError: boolean = false;

  bestRoll: any = {
    rolls: 0,
    essences: 0,
    reols: 0,
    dviggs: 0
  }

  worstRoll: any = {
    rolls: 0,
    essences: 0,
    reols: 0,
    dviggs: 0
  }

  allRolls: any = {
    rolls: 0,
    essences: 0,
    reols: 0,
    dviggs: 0
  }

  bestSteps: any[] = [];
  rollSum: number = 0;
  averageResult!: CalculationResult | undefined;
  bestResult!: CalculationResult | undefined;
  worstResult!: CalculationResult | undefined;

  constructor(
    private customInputService: CustomNumberInputService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.fillUpgradeChoices();
  }

  ngOnDestroy() {
    this.saveData();
  }

  fillUpgradeChoices() {
    let oldChoices = this.userUpgradeChoices.length;

    let targetLevel = this.customInputService.stringAsNumber(this.targetLevel);
    if (targetLevel <= oldChoices) {
      this.userUpgradeChoices = this.userUpgradeChoices.slice(0, targetLevel);
      return;
    }

    for (let i = oldChoices; i < targetLevel; i++) {
      let previousChoice = this.userUpgradeChoices[i-1];
      if (previousChoice) {
        this.userUpgradeChoices[i] = {
          level: i + 1,
          useEssence: previousChoice.useEssence,
          useReol: previousChoice.useReol,
          useDvigg: previousChoice.useDvigg
        }
        continue;
      }
      this.userUpgradeChoices[i] = {
        level: i + 1,
        useEssence: false,
        useReol: false,
        useDvigg: false
      }
    }
  }

  simulateAsync() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.currentWorker = new Worker(new URL('./upgrade-simulator.worker', import.meta.url));

      let data: WorkerData = {
        targetLevel: this.customInputService.stringAsNumber(this.targetLevel),
        rollAmount: this.customInputService.stringAsNumber(this.rollsAmount),
        userUpgradeChoices: this.userUpgradeChoices,
        itemDurability: this.customInputService.stringAsNumber(this.itemDurability)
      }
      this.currentWorker.postMessage(data);
      this.currentWorker.onmessage = ({ data }) => {
        if (data.type === "stage") {
          this.workerStage = data.value;
        } else {
          this.calculateResultResponse(data.value);
          this.currentWorker.terminate();
        }
      };

    } else {
      this.workError = true;
    }
  }

  stopSimulation() {
    this.currentWorker.terminate();
    this.workerStage = 0;
    this.rollAmountWork = 0;
    this.isWorking = false;
  }

  initUpgrade() {
    this.isWorking = true;
    this.rollAmountWork = this.customInputService.stringAsNumber(this.rollsAmount);
    this.clean();
    this.simulateAsync();
  }


  calculateResultResponse(response: WorkerResponse) {
    this.rollSum += this.rollAmountWork;
    //INSERT WORKER DATA

    this.allRolls.rolls += response.allRolls.rolls;
    this.allRolls.essences += response.allRolls.essences;
    this.allRolls.reols += response.allRolls.reols;
    this.allRolls.dviggs += response.allRolls.dviggs;

    if (this.bestRoll.rolls === 0 || this.bestRoll.rolls > response.bestRoll.rolls) {
      this.bestRoll.rolls = response.bestRoll.rolls;
      this.bestRoll.essences = response.bestRoll.essences;
      this.bestRoll.reols = response.bestRoll.reols;
      this.bestRoll.dviggs = response.bestRoll.dviggs;
      this.bestSteps = response.bestSteps;
    }
    if (this.worstRoll.rolls === 0 || this.worstRoll.rolls < response.worstRoll.rolls) {
      this.worstRoll.rolls = response.worstRoll.rolls;
      this.worstRoll.essences = response.worstRoll.essences;
      this.worstRoll.reols = response.worstRoll.reols;
      this.worstRoll.dviggs = response.worstRoll.dviggs;
    }

    //FINAL COUNT

    let rollCosts = this.rankPrices.find(rank => rank.rank === this.itemRank);
    let averageRolls = Math.round(this.allRolls.rolls / this.rollSum);
    let averageEssences = Math.round(this.allRolls.essences / this.rollSum);
    let averageReols = Math.round(this.allRolls.reols / this.rollSum);
    let averageDviggs = Math.round(this.allRolls.dviggs / this.rollSum);
    this.averageResult = {
      clockRollsFlasksAndInhibitors: averageRolls,
      clockRollsCost: averageRolls * rollCosts.rollPrice,
      inhiCost: averageRolls * rollCosts.inhiPrice * this.customInputService.stringAsNumber(this.platinumPrice),
      flaskCost: averageRolls * this.customInputService.stringAsNumber(this.flaskPrice),
      usedEssences: averageEssences,
      essencesCost: averageEssences * this.customInputService.stringAsNumber(this.essencePrice),
      usedReols: averageReols,
      reolsCost: averageReols * this.customInputService.stringAsNumber(this.reolPrice),
      usedDviggs: averageDviggs,
      dviggsCost: averageDviggs * this.customInputService.stringAsNumber(this.dviggPrice),
      costSum: 0
    }
    this.averageResult.costSum =
      this.averageResult.clockRollsCost + this.averageResult.inhiCost + this.averageResult.flaskCost +
      this.averageResult.essencesCost + this.averageResult.reolsCost + this.averageResult.dviggsCost;

    this.bestResult = {
      clockRollsFlasksAndInhibitors: this.bestRoll.rolls,
      clockRollsCost: this.bestRoll.rolls * rollCosts.rollPrice,
      inhiCost: this.bestRoll.rolls * rollCosts.inhiPrice * this.customInputService.stringAsNumber(this.platinumPrice),
      flaskCost: this.bestRoll.rolls * this.customInputService.stringAsNumber(this.flaskPrice),
      usedEssences: this.bestRoll.essences,
      essencesCost: this.bestRoll.essences * this.customInputService.stringAsNumber(this.essencePrice),
      usedReols: this.bestRoll.reols,
      reolsCost: this.bestRoll.reols * this.customInputService.stringAsNumber(this.reolPrice),
      usedDviggs: this.bestRoll.dviggs,
      dviggsCost: this.bestRoll.dviggs * this.customInputService.stringAsNumber(this.dviggPrice),
      costSum: 0
    }
    this.bestResult.costSum =
      this.bestResult.clockRollsCost + this.bestResult.inhiCost + this.bestResult.flaskCost +
      this.bestResult.essencesCost + this.bestResult.reolsCost + this.bestResult.dviggsCost;

    this.worstResult = {
      clockRollsFlasksAndInhibitors: this.worstRoll.rolls,
      clockRollsCost: this.worstRoll.rolls * rollCosts.rollPrice,
      inhiCost: this.worstRoll.rolls * rollCosts.inhiPrice * this.customInputService.stringAsNumber(this.platinumPrice),
      flaskCost: this.worstRoll.rolls * this.customInputService.stringAsNumber(this.flaskPrice),
      usedEssences: this.worstRoll.essences,
      essencesCost: this.worstRoll.essences * this.customInputService.stringAsNumber(this.essencePrice),
      usedReols: this.worstRoll.reols,
      reolsCost: this.worstRoll.reols * this.customInputService.stringAsNumber(this.reolPrice),
      usedDviggs: this.worstRoll.dviggs,
      dviggsCost: this.worstRoll.dviggs * this.customInputService.stringAsNumber(this.dviggPrice),
      costSum: 0
    }
    this.worstResult.costSum =
      this.worstResult.clockRollsCost + this.worstResult.inhiCost + this.worstResult.flaskCost +
      this.worstResult.essencesCost + this.worstResult.reolsCost + this.worstResult.dviggsCost;

    this.isWorking = false;
    this.workerStage = 0;
    this.bestSteps = []; //todo remove
  }

  clean() {
    if (this.cumulateRolls) {
      return;
    }

    this.rollSum = 0;
    /*this.averageResult = undefined;
    this.bestResult = undefined;
    this.worstResult = undefined;*/
    this.worstRoll = {
      rolls: 0,
      essences: 0,
      reols: 0,
      dviggs: 0
    }
    this.bestRoll = {
      rolls: 0,
      essences: 0,
      reols: 0,
      dviggs: 0
    }
    this.allRolls = {
      rolls: 0,
      essences: 0,
      reols: 0,
      dviggs: 0
    }
  }


  pushToOthers(event: MatCheckboxChange, checkbox: string, index: number) {
    if (!this.continueIngredients) {
      return;
    }
    switch (checkbox) {
      case "essence": {
        this.userUpgradeChoices.forEach(choice => {
          if (choice.level > index) {
            choice.useEssence = event.checked;
          }
        })
        break;
      }
      case "reol": {
        this.userUpgradeChoices.forEach(choice => {
          if (choice.level > index) {
            choice.useReol = event.checked;
          }
        })
        break;
      }
      case "dvigg": {
        this.userUpgradeChoices.forEach(choice => {
          if (choice.level > index) {
            choice.useDvigg = event.checked;
          }
        })
        break;
      }
    }
  }

  kSpace(event: Event, field: string) {
    let target = event.target as HTMLInputElement;
    let result = this.customInputService.formatInput(event);
    if (Number.parseInt(target.max) < result) {
      this.customInputService.insertSpacesEveryThree(target.max);
      target.value = this.customInputService.insertSpacesEveryThree(target.max);
    }

    this.insertToField(target.value, field);


  }

  insertToField(string: string, field: string) {
    for (const key in this) {
      if(key === field) {
        // @ts-ignore
        this[key] = string;
      }
    }
  }

  saveData() {
    let data: any = {
      itemRank: this.itemRank,
      targetLevel: this.targetLevel,
      itemDurability: this.itemDurability,
      platinumPrice: this.platinumPrice,
      essencePrice: this.essencePrice,
      flaskPrice: this.flaskPrice,
      reolPrice: this.reolPrice,
      dviggPrice: this.dviggPrice,
      rollsAmount: this.rollsAmount
    }
    localStorage.setItem("upgrade-simulator", JSON.stringify(data));
  }

  loadData() {
    let dataString = localStorage.getItem("upgrade-simulator");
    if (!dataString) {
      return;
    }
    let data: any = JSON.parse(dataString);

    this.itemRank = data.itemRank;
    this.targetLevel = data.targetLevel;
    this.itemDurability = data.itemDurability;
    this.platinumPrice = data.platinumPrice;
    this.essencePrice = data.essencePrice;
    this.flaskPrice = data.flaskPrice;
    this.reolPrice = data.reolPrice;
    this.dviggPrice = data.dviggPrice;
    this.rollsAmount = data.rollsAmount;
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveData();
  }
}

/// <reference lib="webworker" />

import {WorkerData} from "@models/upgrade-simulator/workerData";
import {WorkerResponse} from "@models/upgrade-simulator/workerResponse";

addEventListener('message', ({ data }) => {
  let workerResponse = work(data);
  clean();
  postMessage({type: "result", value: workerResponse});
});

let essenceUpgradeChanceBoost: number = 10;
let essenceUpgradeChanceBoostFirstLevel: number = 2;
let reolDurabilityBoost: number = 20;
let dviggMegaUpgradeBoost: number = 2;

let upgradeChances: any[] = [
  {
    toLevel: 1,
    chance: 95
  },
  {
    toLevel: 2,
    chance: 85
  },
  {
    toLevel: 3,
    chance: 75
  },
  {
    toLevel: 4,
    chance: 65
  },
  {
    toLevel: 5,
    chance: 50
  },
  {
    toLevel: 6,
    chance: 40
  },
  {
    toLevel: 7,
    chance: 30
  },
  {
    toLevel: 8,
    chance: 20
  },
  {
    toLevel: 9,
    chance: 10
  },
]

let bestRoll: any = {
  rolls: 0,
  essences: 0,
  reols: 0,
  dviggs: 0
}

let worstRoll: any = {
  rolls: 0,
  essences: 0,
  reols: 0,
  dviggs: 0
}

let allRolls: any = {
  rolls: 0,
  essences: 0,
  reols: 0,
  dviggs: 0
}

let currentRoll: any = {
  rolls: 0,
  essences: 0,
  reols: 0,
  dviggs: 0
}

let currentLevel = 0;
let steps: any[] = [];
let bestSteps: any[] = [];


function clean() {
  currentLevel = 0;
  steps = [];
  bestSteps = [];

  bestRoll = {
    rolls: 0,
    essences: 0,
    reols: 0,
    dviggs: 0
  }

  worstRoll = {
    rolls: 0,
    essences: 0,
    reols: 0,
    dviggs: 0
  }

  allRolls = {
    rolls: 0,
    essences: 0,
    reols: 0,
    dviggs: 0
  }

  currentRoll = {
    rolls: 0,
    essences: 0,
    reols: 0,
    dviggs: 0
  }
}

function work(data: WorkerData): WorkerResponse {
  let progress = 0;
  for (let i = 1; i < data.rollAmount + 1; i++) {
    let newProgress = Math.floor((i / data.rollAmount) * 100);
    if (newProgress > progress) {
      progress = newProgress;
      postMessage({type: "stage", value: progress});
    }
    let rolls = 0;

    while (currentLevel < data.targetLevel) {
      let upgradeChance = upgradeChances.find(up => up.toLevel === currentLevel + 1);
      if (!upgradeChance) {
        upgradeChance = upgradeChances[upgradeChances.length-1];
      }
      let upgradeChoices = data.userUpgradeChoices.find(choice => choice.level === currentLevel + 1);
      doUpgrade(currentLevel + 1, upgradeChance.chance, upgradeChoices, rolls, data.itemDurability);
      rolls++;
    }
    calculateResultCycle(rolls);
  }

  return {
    allRolls: allRolls,
    bestRoll: bestRoll,
    worstRoll: worstRoll,
    bestSteps: bestSteps
  };
}

function doUpgrade(toLevel: number, upgradeChance: number, upgradeChoices: any, rollNo: number, itemDurability: number) {
  steps[rollNo] = {
    rollNo: rollNo +1
  };
  let realChance: number = upgradeChance;
  let realDurability: number = itemDurability;
  let megaUpgradeChance: number = 1;

  if (upgradeChoices.useEssence) {
    currentRoll.essences++;
    if (toLevel === 1) {
      realChance = upgradeChance + essenceUpgradeChanceBoostFirstLevel;
    } else {
      realChance = upgradeChance + essenceUpgradeChanceBoost;
    }
  }
  if (upgradeChoices.useReol) {
    realDurability = itemDurability + reolDurabilityBoost;
    currentRoll.reols++;
  }
  if (upgradeChoices.useDvigg) {
    megaUpgradeChance += dviggMegaUpgradeBoost;
    currentRoll.dviggs++;
  }

  let rolledNumber = getRandomInt(100);
  //console.log("UPGRADE ROLL: " + rolledNumber + " <= " + realChance)
  let success = rolledNumber <= realChance;

  steps[rollNo].success = success;
  if (success) {
    if (rolledNumber <= megaUpgradeChance) {
      steps[rollNo].mega = true;
      currentLevel += 2;
      steps[rollNo].finalLevel = currentLevel;
      return;
    }
    currentLevel++;
    steps[rollNo].finalLevel = currentLevel;
    return;
  }

  //console.log("RESIST CHECK")
  let resist = getRandomInt(100) <= realDurability;
  if (!resist) {
    currentLevel = 0;
  }
  steps[rollNo].resist = resist;
  steps[rollNo].finalLevel = currentLevel;

  steps = []; //TODO REMOVE?
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max + 1);
}

function calculateResultCycle(rolls: number) {
  currentRoll.rolls = rolls;

  allRolls.rolls += currentRoll.rolls;
  allRolls.essences += currentRoll.essences;
  allRolls.reols += currentRoll.reols;
  allRolls.dviggs += currentRoll.dviggs;

  if (bestRoll.rolls === 0 || bestRoll.rolls > rolls) {
    bestRoll.rolls = currentRoll.rolls;
    bestRoll.essences = currentRoll.essences;
    bestRoll.reols = currentRoll.reols;
    bestRoll.dviggs = currentRoll.dviggs;
    bestSteps = steps;
  }
  if (worstRoll.rolls === 0 || worstRoll.rolls < rolls) {
    worstRoll.rolls = currentRoll.rolls;
    worstRoll.essences = currentRoll.essences;
    worstRoll.reols = currentRoll.reols;
    worstRoll.dviggs = currentRoll.dviggs;
  }

  steps = [];

  currentRoll = {
    rolls: 0,
    essences: 0,
    reols: 0,
    dviggs: 0
  };
  currentLevel = 0;
}


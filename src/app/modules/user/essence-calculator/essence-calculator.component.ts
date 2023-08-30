import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ItemToEssences} from "./model/itemToEssences";
import {ShardsByTier} from "./model/shardsByTier";
import {SyngPrice} from "./model/syngPrice";
import {CustomInputService} from "../../../common/service/custom-input.service";

@Component({
  selector: 'app-essence-calculator',
  templateUrl: './essence-calculator.component.html',
  styleUrls: ['./essence-calculator.component.scss']
})
export class EssenceCalculatorComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('inputPlat') inputPlat!: ElementRef;
  @ViewChild('inputEse') inputEse!: ElementRef;
  @ViewChild('inputShard') inputShard!: ElementRef;
  displayedColumns: string[] = [
    "Ranga",
    "Esencje",
    "Esencje z inhi",
    "Odłamki",
    "Odłamki z inhi",
    "Odłamki syng",
    "Odłamki syng z inhi",
    "Próg eski z inhi",
    "Próg eski bez inhi",
    "Próg odłamki z inhi",
    "Próg odłamki bez inhi",
    "Próg odłamki syng z inhi",
    "Próg odłamki syng bez inhi",
    /*"Zysk z inhi"*/
  ];
  syngColumns: string[] = [
    "lvl",
    "price",
  ];

  calculations: ItemToEssences[] = [
    {
      rank: "I",
      inhiPrice: 3,
      essences: 2,
      essencesWithInhi: 3,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "II",
      inhiPrice: 4,
      essences: 5,
      essencesWithInhi: 7,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "III",
      inhiPrice: 4,
      essences: 12,
      essencesWithInhi: 16,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "IV",
      inhiPrice: 5,
      essences: 24,
      essencesWithInhi: 32,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "V",
      inhiPrice: 6,
      essences: 32,
      essencesWithInhi: 42,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "VI",
      inhiPrice: 6,
      essences: 40,
      essencesWithInhi: 52,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "VII",
      inhiPrice: 7,
      essences: 55,
      essencesWithInhi: 72,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "VIII",
      inhiPrice: 8,
      essences: 70,
      essencesWithInhi: 91,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "IX",
      inhiPrice: 8,
      essences: 85,
      essencesWithInhi: 111,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "X",
      inhiPrice: 10,
      essences: 115,
      essencesWithInhi: 150,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "XI",
      inhiPrice: 12,
      essences: 145,
      essencesWithInhi: 189,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    },
    {
      rank: "XII",
      inhiPrice: 12,
      essences: 175,
      essencesWithInhi: 228,
      priceThreshold: 0,
      priceThresholdWithInhi: 0,
      incomeWithInhi: 0,
      shards: 0,
      shardsWithInhi: 0,
      shardsFromSyng: 0,
      shardsFromSyngWithInhi: 0,
      earnShard: 0,
      earnShardWithInhi: 0,
      earnShardSyng: 0,
      earnShardSyngWithInhi: 0
    }
  ]

  syngPrices: SyngPrice[] = [
    {lvl: 20, price: 11250},
    {lvl: 30, price: 20250},
    {lvl: 40, price: 36000},
    {lvl: 50, price: 66000},
    {lvl: 60, price: 120000},
    {lvl: 70, price: 210000},
    {lvl: 80, price: 375000},
    {lvl: 90, price: 675000},
    {lvl: 100, price: 1200000},
    {lvl: 110, price: 2250000},
    {lvl: 120, price: 4050000},
    {lvl: 130, price: 7200000},
    {lvl: 140, price: 12750000},
  ]

  extractorPrice: number = 20000;
  marketPremium: boolean = true;
  isSet: boolean = false;
  ignoreTax: boolean = true;
  showSyngPrices: boolean = false;
  ornaments: number = 1;
  shardPrice: number = 0;
  platinumPrice: number = 0;
  essencePrice: number = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private customInputService: CustomInputService //TODO
  ) {
  }

  ngAfterViewInit(): void {
    this.loadData();
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.saveData();
  }

  calculateData() {
    if (this.essencePrice <= 0 || Number.isNaN(this.essencePrice)) {
      this.calculations.forEach(item => {
        item.priceThreshold = 0;
        item.priceThresholdWithInhi = 0;
        item.incomeWithInhi = 0;
      });
      return;
    }

    let tax = this.marketPremium ? 0.98 : 0.96;

    this.calculations.forEach(item => {
      let earn;
      let earnWithInhi;
      let cost;

      //NORMAL PRICE ESSENCE
      cost = this.extractorPrice;
      earn = this.essencePrice * item.essences;

      //TAX ESSENCE
      if (this.ignoreTax) {
        item.priceThreshold = Math.floor(earn - cost);
      } else {
        item.priceThreshold = Math.floor((earn * tax) - cost);
      }

      /*if (Number.isNaN(this.platinumPrice) || this.platinumPrice <= 0) {
        item.priceThresholdWithInhi = 0;
        item.incomeWithInhi = 0;
        return;
      }*/
      //INHI PRICE ESSENCE
      cost += item.inhiPrice * this.platinumPrice;
      earnWithInhi = this.essencePrice * item.essencesWithInhi;

      //TAX ESSENCE
      if (this.ignoreTax) {
        item.priceThresholdWithInhi = Math.floor(earnWithInhi - cost);
      } else {
        item.priceThresholdWithInhi = Math.floor((earnWithInhi * tax) - cost);
      }

      //INHI INCOME
      item.incomeWithInhi = Math.floor(item.priceThresholdWithInhi - item.priceThreshold);

      //SHARDS
      let itemTier: number = this.getItemTier(item.rank);
      let shardItem = shardsByTier.find(tierShards => tierShards.tier === itemTier);
      if (!shardItem) {
        console.log("NOT FOUND SHARD ITEM: " + item);
        return;
      }
      let ornamentShards = shardItem.shardsByOrnament.find(ornament => ornament.ornaments === this.ornaments);
      if (!ornamentShards) {
        console.log("NOT FOUND ORNAMENT SHARDS: " + shardItem);
        return;
      }

      //INSERTING DATA AMOUNT SHARDS
      if (this.isSet) {
        item.shards = ornamentShards.shardAmountSet;
        item.shardsWithInhi = ornamentShards.shardAmountSetWithInhi;
      } else {
        item.shards = ornamentShards.shardsAmount;
        item.shardsWithInhi = ornamentShards.shardsAmountWithInhi;
      }

      item.shardsFromSyng = shardItem.shardAmountSyng;
      item.shardsFromSyngWithInhi = shardItem.shardAmountSyngWithInhi;

      //EARN SHARD
      if (this.ignoreTax) {
        item.earnShard = (item.shards * this.shardPrice) - this.essencePrice - (ornamentShards.requiredEsences * this.essencePrice);
        item.earnShardWithInhi = (item.shardsWithInhi * this.shardPrice) - this.essencePrice - (ornamentShards.requiredEsences * this.essencePrice) - (item.inhiPrice * this.platinumPrice);
      } else {
        item.earnShard = ((item.shards * this.shardPrice) * tax) - this.essencePrice - (ornamentShards.requiredEsences * this.essencePrice);
        item.earnShardWithInhi = ((item.shardsWithInhi * this.shardPrice) * tax) - this.essencePrice - (ornamentShards.requiredEsences * this.essencePrice) - (item.inhiPrice * this.platinumPrice);
      }

      //EARN SHARD SYNG
      if (this.ignoreTax) {
        item.earnShardSyng = (item.shardsFromSyng * this.shardPrice) - this.extractorPrice - (shardItem.requiredEsencesSyng * this.essencePrice);
        item.earnShardSyngWithInhi = (item.shardsFromSyngWithInhi * this.shardPrice) - this.extractorPrice - (shardItem.requiredEsencesSyng * this.essencePrice) - (item.inhiPrice * this.platinumPrice);
      } else {
        item.earnShardSyng = ((item.shardsFromSyng * this.shardPrice) * tax) - this.extractorPrice - (shardItem.requiredEsencesSyng * this.essencePrice);
        item.earnShardSyngWithInhi = ((item.shardsFromSyngWithInhi * this.shardPrice) * tax) - this.extractorPrice - (shardItem.requiredEsencesSyng * this.essencePrice) - (item.inhiPrice * this.platinumPrice);
      }
    })
  }

  getItemTier(rank: string) {
    switch (rank) {
      case "I":
        return 1;
      case "II":
        return 1;
      case "III":
        return 1;
      case "IV":
        return 2;
      case "V":
        return 2;
      case "VI":
        return 2;
      case "VII":
        return 3;
      case "VIII":
        return 3;
      case "IX":
        return 3;
      case "X":
        return 4;
      case "XI":
        return 4;
      case "XII":
        return 4;
      default:
        return 1;
    }
  }

  pushChanges() {
    this.calculateData();
  }

  onInput(event: any, element: string) {
    const value = event.target.value;
    if (!/^\d*$/.test(value)) {
      if (element == "plat") {
        this.inputPlat.nativeElement.value = value.replace(/\D/g, "");
      }
      if (element == "ese") {
        this.inputEse.nativeElement.value = value.replace(/\D/g, "");
      }
      if (element == "shard") {
        this.inputShard.nativeElement.value = value.replace(/\D/g, "");
      }
    }

    if (element == "plat") {
      this.formatValue(this.inputPlat.nativeElement.value, this.inputPlat);
      this.platinumPrice = parseInt(value.replace(/[- ]/g, ""));
    }
    if (element == "ese") {
      this.formatValue(this.inputEse.nativeElement.value, this.inputEse);
      this.essencePrice = parseInt(value.replace(/[- ]/g, ""));
    }
    if (element == "shard") {
      this.formatValue(this.inputShard.nativeElement.value, this.inputShard);
      this.shardPrice = parseInt(value.replace(/[- ]/g, ""));
    }
    this.calculateData();

  }

  formatValue(value: string, input: ElementRef) {
    input.nativeElement.value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }

  private saveData() {
    if (this.platinumPrice != 0) {
      localStorage.setItem("essences-platinum-price", JSON.stringify(this.platinumPrice));
    }
    if (this.essencePrice != 0) {
      localStorage.setItem("essences-essence-price", JSON.stringify(this.essencePrice));
    }
    if (this.shardPrice != 0) {
      localStorage.setItem("essences-shard-price", JSON.stringify(this.shardPrice));
    }
    localStorage.setItem("essences-market-premium", JSON.stringify(this.marketPremium));
    localStorage.setItem("essences-is-set", JSON.stringify(this.isSet));
    localStorage.setItem("essences-ignore-tax", JSON.stringify(this.ignoreTax));
    localStorage.setItem("essences-ornaments", JSON.stringify(this.ornaments));
    localStorage.setItem("essences-show-syng", JSON.stringify(this.showSyngPrices));
  }

  private loadData() {
    let platinum = localStorage.getItem("essences-platinum-price");
    let essence = localStorage.getItem("essences-essence-price");
    let shard = localStorage.getItem("essences-shard-price");
    let premium = localStorage.getItem("essences-market-premium");
    let set = localStorage.getItem("essences-is-set");
    let tax = localStorage.getItem("essences-ignore-tax");
    let ornaments = localStorage.getItem("essences-ornaments");
    let syngs = localStorage.getItem("essences-show-syng");

    if (platinum != null && platinum != "null") {
      this.formatValue(platinum, this.inputPlat);
      this.platinumPrice = parseInt(platinum);
    }
    if (essence != null && essence != "null") {
      this.formatValue(essence, this.inputEse);
      this.essencePrice = parseInt(essence);
    }
    if (shard != null && shard != "null") {
      this.formatValue(shard, this.inputShard);
      this.shardPrice = parseInt(shard);
    }
    if (premium != null && premium != "null") {
      this.marketPremium = (premium === "true");
    }
    if (set != null && set != "null") {
      this.isSet = (set === "true");
    }
    if (tax != null && tax != "null") {
      this.ignoreTax = (tax === "true");
    }
    if (ornaments != null && ornaments != "null") {
      this.ornaments = parseInt(ornaments);
    }
    if (syngs != null && syngs != "null") {
      this.showSyngPrices = (syngs === "true");
    }
    this.calculateData();
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveData();
  }

  protected readonly Number = Number;

  /*jumpToSyngs() {
    setTimeout(() => {
        document.querySelector('#syngs')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 75);
  }*/
}

const shardsByTier: ShardsByTier[] = [
  {
    tier: 1,
    shardAmountSyng: 1,
    shardAmountSyngWithInhi: 2,
    requiredEsencesSyng: 1,
    shardsByOrnament: [
      {
        ornaments: 1,
        shardsAmount: 3,
        shardsAmountWithInhi: 4,
        shardAmountSet: 5,
        shardAmountSetWithInhi: 7,
        requiredEsences: 1
      },
      {
        ornaments: 2,
        shardsAmount: 5,
        shardsAmountWithInhi: 7,
        shardAmountSet: 8,
        shardAmountSetWithInhi: 11,
        requiredEsences: 1
      },
      {
        ornaments: 3,
        shardsAmount: 8,
        shardsAmountWithInhi: 11,
        shardAmountSet: 12,
        shardAmountSetWithInhi: 16,
        requiredEsences: 1
      },
      {
        ornaments: 4,
        shardsAmount: 12,
        shardsAmountWithInhi: 16,
        shardAmountSet: 18,
        shardAmountSetWithInhi: 24,
        requiredEsences: 5
      },
      {
        ornaments: 5,
        shardsAmount: 20,
        shardsAmountWithInhi: 26,
        shardAmountSet: 30,
        shardAmountSetWithInhi: 39,
        requiredEsences: 5
      },
      {
        ornaments: 6,
        shardsAmount: 30,
        shardsAmountWithInhi: 39,
        shardAmountSet: 45,
        shardAmountSetWithInhi: 59,
        requiredEsences: 5
      },
      {
        ornaments: 7,
        shardsAmount: 50,
        shardsAmountWithInhi: 65,
        shardAmountSet: 75,
        shardAmountSetWithInhi: 98,
        requiredEsences: 25
      },
      {
        ornaments: 8,
        shardsAmount: 100,
        shardsAmountWithInhi: 130,
        shardAmountSet: 150,
        shardAmountSetWithInhi: 195,
        requiredEsences: 25
      },
      {
        ornaments: 9,
        shardsAmount: 250,
        shardsAmountWithInhi: 325,
        shardAmountSet: 350,
        shardAmountSetWithInhi: 455,
        requiredEsences: 25
      },
    ]
  },
  {
    tier: 2,
    shardAmountSyng: 5,
    shardAmountSyngWithInhi: 7,
    requiredEsencesSyng: 2,
    shardsByOrnament: [
      {
        ornaments: 1,
        shardsAmount: 15,
        shardsAmountWithInhi: 20,
        shardAmountSet: 20,
        shardAmountSetWithInhi: 26,
        requiredEsences: 2
      },
      {
        ornaments: 2,
        shardsAmount: 20,
        shardsAmountWithInhi: 26,
        shardAmountSet: 30,
        shardAmountSetWithInhi: 39,
        requiredEsences: 2
      },
      {
        ornaments: 3,
        shardsAmount: 40,
        shardsAmountWithInhi: 52,
        shardAmountSet: 50,
        shardAmountSetWithInhi: 65,
        requiredEsences: 2
      },
      {
        ornaments: 4,
        shardsAmount: 60,
        shardsAmountWithInhi: 78,
        shardAmountSet: 100,
        shardAmountSetWithInhi: 130,
        requiredEsences: 10
      },
      {
        ornaments: 5,
        shardsAmount: 100,
        shardsAmountWithInhi: 130,
        shardAmountSet: 150,
        shardAmountSetWithInhi: 195,
        requiredEsences: 10
      },
      {
        ornaments: 6,
        shardsAmount: 150,
        shardsAmountWithInhi: 195,
        shardAmountSet: 250,
        shardAmountSetWithInhi: 325,
        requiredEsences: 10
      },
      {
        ornaments: 7,
        shardsAmount: 250,
        shardsAmountWithInhi: 325,
        shardAmountSet: 400,
        shardAmountSetWithInhi: 520,
        requiredEsences: 50
      },
      {
        ornaments: 8,
        shardsAmount: 500,
        shardsAmountWithInhi: 650,
        shardAmountSet: 750,
        shardAmountSetWithInhi: 975,
        requiredEsences: 50
      },
      {
        ornaments: 9,
        shardsAmount: 1250,
        shardsAmountWithInhi: 1625,
        shardAmountSet: 1800,
        shardAmountSetWithInhi: 2340,
        requiredEsences: 50
      },
    ]
  },
  {
    tier: 3,
    shardAmountSyng: 25,
    shardAmountSyngWithInhi: 33,
    requiredEsencesSyng: 3,
    shardsByOrnament: [
      {
        ornaments: 1,
        shardsAmount: 75,
        shardsAmountWithInhi: 98,
        shardAmountSet: 90,
        shardAmountSetWithInhi: 117,
        requiredEsences: 3
      },
      {
        ornaments: 2,
        shardsAmount: 100,
        shardsAmountWithInhi: 130,
        shardAmountSet: 120,
        shardAmountSetWithInhi: 156,
        requiredEsences: 3
      },
      {
        ornaments: 3,
        shardsAmount: 200,
        shardsAmountWithInhi: 260,
        shardAmountSet: 250,
        shardAmountSetWithInhi: 325,
        requiredEsences: 3
      },
      {
        ornaments: 4,
        shardsAmount: 300,
        shardsAmountWithInhi: 390,
        shardAmountSet: 450,
        shardAmountSetWithInhi: 585,
        requiredEsences: 15
      },
      {
        ornaments: 5,
        shardsAmount: 500,
        shardsAmountWithInhi: 650,
        shardAmountSet: 750,
        shardAmountSetWithInhi: 975,
        requiredEsences: 15
      },
      {
        ornaments: 6,
        shardsAmount: 750,
        shardsAmountWithInhi: 975,
        shardAmountSet: 1100,
        shardAmountSetWithInhi: 1430,
        requiredEsences: 15
      },
      {
        ornaments: 7,
        shardsAmount: 1250,
        shardsAmountWithInhi: 1625,
        shardAmountSet: 2000,
        shardAmountSetWithInhi: 2600,
        requiredEsences: 75
      },
      {
        ornaments: 8,
        shardsAmount: 2500,
        shardsAmountWithInhi: 3250,
        shardAmountSet: 4000,
        shardAmountSetWithInhi: 5200,
        requiredEsences: 75
      },
      {
        ornaments: 9,
        shardsAmount: 6500,
        shardsAmountWithInhi: 8450,
        shardAmountSet: 9000,
        shardAmountSetWithInhi: 11700,
        requiredEsences: 75
      },
    ]
  },
  {
    tier: 4,
    shardAmountSyng: 125,
    shardAmountSyngWithInhi: 163,
    requiredEsencesSyng: 4,
    shardsByOrnament: [
      {
        ornaments: 1,
        shardsAmount: 300,
        shardsAmountWithInhi: 390,
        shardAmountSet: 350,
        shardAmountSetWithInhi: 455,
        requiredEsences: 4
      },
      {
        ornaments: 2,
        shardsAmount: 500,
        shardsAmountWithInhi: 650,
        shardAmountSet: 550,
        shardAmountSetWithInhi: 715,
        requiredEsences: 4
      },
      {
        ornaments: 3,
        shardsAmount: 1000,
        shardsAmountWithInhi: 1300,
        shardAmountSet: 1200,
        shardAmountSetWithInhi: 1560,
        requiredEsences: 4
      },
      {
        ornaments: 4,
        shardsAmount: 1500,
        shardsAmountWithInhi: 1950,
        shardAmountSet: 2200,
        shardAmountSetWithInhi: 2860,
        requiredEsences: 20
      },
      {
        ornaments: 5,
        shardsAmount: 2500,
        shardsAmountWithInhi: 3250,
        shardAmountSet: 4000,
        shardAmountSetWithInhi: 5200,
        requiredEsences: 20
      },
      {
        ornaments: 6,
        shardsAmount: 4000,
        shardsAmountWithInhi: 5200,
        shardAmountSet: 6000,
        shardAmountSetWithInhi: 7800,
        requiredEsences: 20
      },
      {
        ornaments: 7,
        shardsAmount: 6500,
        shardsAmountWithInhi: 8450,
        shardAmountSet: 10000,
        shardAmountSetWithInhi: 13000,
        requiredEsences: 100
      },
      {
        ornaments: 8,
        shardsAmount: 12500,
        shardsAmountWithInhi: 16250,
        shardAmountSet: 20000,
        shardAmountSetWithInhi: 26000,
        requiredEsences: 100
      },
      {
        ornaments: 9,
        shardsAmount: 30000,
        shardsAmountWithInhi: 39000,
        shardAmountSet: 45000,
        shardAmountSetWithInhi: 58500,
        requiredEsences: 100
      },
    ]
  }
]

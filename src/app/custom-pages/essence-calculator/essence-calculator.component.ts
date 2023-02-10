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

@Component({
  selector: 'app-essence-calculator',
  templateUrl: './essence-calculator.component.html',
  styleUrls: ['./essence-calculator.component.scss']
})
export class EssenceCalculatorComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('inputPlat') inputPlat!: ElementRef;
  @ViewChild('inputEse') inputEse!: ElementRef;
  displayedColumns: string[] = [
    "Ranga",
    "Esencje",
    "Esencje z inhi",
    "Próg opłacalności z inhi",
    "Próg opłacalności bez inhi",
    "Zysk z inhi"
  ];
  calculations: ItemToEssences[] = [
    {rank: "I", inhiPrice: 3, essences: 2, essencesWithInhi: 3, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "II", inhiPrice: 4, essences: 5, essencesWithInhi: 7, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "III", inhiPrice: 4, essences: 12, essencesWithInhi: 16, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "IV", inhiPrice: 5, essences: 24, essencesWithInhi: 32, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "V", inhiPrice: 6, essences: 32, essencesWithInhi: 42, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "VI", inhiPrice: 6, essences: 40, essencesWithInhi: 52, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "VII", inhiPrice: 7, essences: 55, essencesWithInhi: 72, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "VIII", inhiPrice: 8, essences: 70, essencesWithInhi: 91, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "IX", inhiPrice: 8, essences: 85, essencesWithInhi: 111, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "X", inhiPrice: 10, essences: 115, essencesWithInhi: 150, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "XI", inhiPrice: 12, essences: 145, essencesWithInhi: 189, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0},
    {rank: "XII", inhiPrice: 12, essences: 175, essencesWithInhi: 228, priceThreshold: 0, priceThresholdWithInhi: 0, incomeWithInhi: 0}
  ]
  extractorPrice: number = 20000;
  marketPremium: boolean = true;
  platinumPrice: number = 0;
  essencePrice: number = 0;


  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

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
    if(this.essencePrice <= 0 || Number.isNaN(this.essencePrice)) {
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

      //NORMAL PRICE
      cost = this.extractorPrice;
      earn = this.essencePrice * item.essences;

      item.priceThreshold = Math.floor((earn * tax) - cost);

      if (Number.isNaN(this.platinumPrice) || this.platinumPrice <= 0) {
        item.priceThresholdWithInhi = 0;
        item.incomeWithInhi = 0;
        return;
      }
      //INHI PRICE
      cost += item.inhiPrice * this.platinumPrice;
      earnWithInhi = this.essencePrice * item.essencesWithInhi;
      item.priceThresholdWithInhi = Math.floor((earnWithInhi * tax) - cost);

      //INHI INCOME
      item.incomeWithInhi = Math.floor(item.priceThresholdWithInhi - item.priceThreshold);

    })

  }

  changePremiumMarket() {
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
    }

    if (element == "plat") {
      this.formatValue(this.inputPlat.nativeElement.value, this.inputPlat);
      this.platinumPrice = parseInt(value.replace(/[- ]/g, ""));
    }
    if (element == "ese") {
      this.formatValue(this.inputEse.nativeElement.value, this.inputEse);
      this.essencePrice = parseInt(value.replace(/[- ]/g, ""));
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
    localStorage.setItem("essences-market-premium", JSON.stringify(this.marketPremium));
  }

  private loadData() {
    let platinum = localStorage.getItem("essences-platinum-price");
    let essence = localStorage.getItem("essences-essence-price");
    let premium = localStorage.getItem("essences-market-premium");

    if (platinum != null && platinum != "null") {
      this.formatValue(platinum, this.inputPlat);
      this.platinumPrice = parseInt(platinum);
    }
    if (essence != null && essence != "null") {
      this.formatValue(essence, this.inputEse);
      this.essencePrice = parseInt(essence);
    }
    if (premium != null && essence != "null") {
      this.marketPremium = (premium === "true");
    }
    this.calculateData();
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveData();
  }
}

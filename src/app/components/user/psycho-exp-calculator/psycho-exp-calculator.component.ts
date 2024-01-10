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
import {ItemPsycho} from "@models/psycho-exp-calculator/itemPsycho";
import {Calculation} from "@models/psycho-exp-calculator/calculation";

@Component({
  selector: 'app-psycho-exp-calculator',
  templateUrl: './psycho-exp-calculator.component.html',
  styleUrls: ['./psycho-exp-calculator.component.scss']
})
export class PsychoExpCalculatorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('inputCost') inputCost!: ElementRef;
  @ViewChild('inputEarn') inputEarn!: ElementRef;
  @ViewChild('inputPercent') inputPercent!: ElementRef;
  @ViewChild('inputTime') inputTime!: ElementRef;
  displayedColumns: string[] = [
    "Do lvla",
    "Psychoexp",
    "Instancji",
    "Koszt",
    "Czas w minutach",
    "Czas w godzinach",
  ];
  itemsLevels: ItemPsycho[] = [
    {rank: 1, levels: [
        {level: 1, startExpSum: 0, endExpSum: 1000},
        {level: 2, startExpSum: 1000, endExpSum: 4000},
        {level: 3, startExpSum: 4000, endExpSum: 12000},
        {level: 4, startExpSum: 12000, endExpSum: 24000},
        {level: 5, startExpSum: 24000, endExpSum: 40000},
        {level: 6, startExpSum: 40000, endExpSum: 68000},
        {level: 7, startExpSum: 68000, endExpSum: 100000},
        {level: 8, startExpSum: 100000, endExpSum: 140000},
        {level: 9, startExpSum: 140000, endExpSum: 190000},
        {level: 10, startExpSum: 190000, endExpSum: 250000},
        {level: 11, startExpSum: 250000, endExpSum: 320000},
        {level: 12, startExpSum: 320000, endExpSum: 400000},
        {level: 13, startExpSum: 400000, endExpSum: 500000},
        {level: 14, startExpSum: 500000, endExpSum: 700000},
        {level: 15, startExpSum: 700000, endExpSum: 1000000},
        {level: 16, startExpSum: 1000000, endExpSum: 1500000},
        {level: 17, startExpSum: 1500000, endExpSum: 2000000},
        {level: 18, startExpSum: 2000000, endExpSum: 3000000},
        {level: 19, startExpSum: 3000000, endExpSum: 4000000},
        {level: 20, startExpSum: 4000000, endExpSum: 5000000},
        {level: 21, startExpSum: 5000000, endExpSum: 5000000}
    ]}
  ]
  calculations: Calculation[] = [
    {level: 2, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 3, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 4, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 5, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 6, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 7, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 8, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 9, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 10, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 11, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 12, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 13, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 14, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 15, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 16, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 17, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 18, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 19, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 20, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
    {level: 21, psychoexp: 0, instances: 0, price: 0, time: 0, timeInHours: 0},
  ]

  actualLevel: string = "1";
  cost: number = 0;
  earn: number = 0;
  percent: number = 0;
  currentPsycho: number = 0;
  time: number = 0;
  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.saveData();
  }

  ngAfterViewInit(): void {
    this.loadData();
    this.calculate();
    this.changeDetectorRef.detectChanges();
  }

  calculate() {

    let level: number = parseInt(this.actualLevel);

    let itemPsycho = this.itemsLevels[0];
    let actualPsychoLevel = itemPsycho!.levels.find(psychoLevel => psychoLevel.level == level);

    let onePercent = (actualPsychoLevel!.endExpSum - actualPsychoLevel!.startExpSum) / 100;
    this.currentPsycho = actualPsychoLevel!.startExpSum + (onePercent * this.percent);

    this.calculations.forEach(item => {
      let psychoLevel = itemPsycho!.levels.find(target => target.level == item.level -1);

      item.psychoexp = psychoLevel!.endExpSum - this.currentPsycho;
      if (item.psychoexp <= 0) {
        item.psychoexp = 0;
        item.instances = 0;
        item.price = 0;
        item.time = 0;
        item.timeInHours = 0;
        return;
      }

      item.instances = Math.ceil(item.psychoexp / this.earn);
      if (Number.isNaN(item.instances) || !Number.isFinite(item.instances)) {
        item.instances = 0;
      }
      item.price = Math.ceil(item.instances * this.cost);
      item.time = Math.ceil((item.instances * this.time) / 60);
      item.timeInHours = Math.ceil(item.time / 60);
    })

  }

  rankUpdate(value: string) {
    this.calculate();
  }

  targetLevelUpdate(value: string) {
    this.calculate();
  }

  onInput(event: any, element: HTMLInputElement, name: string) {
    const text = event.target.value;
    if (!/^\d*$/.test(text)) {
      element.value = text.replace(/\D/g, "");
    }
    this.formatValue(element.value, element);
    const value: number = parseInt(element.value.replace(/[- ]/g, ""));

    if (name == "percent") {
      if (value < 0) {
        this.percent = 0;
        element.value = "0";
        return;
      }
      if (value > 99) {
        this.percent = 99;
        element.value = "99";
        return;
      }
      this.percent = value;
    }

    if (name == "cost") {
      this.cost = value;
    }
    if (name == "earn") {
      this.earn = value;
    }
    if (name == "time") {
      this.time = value;
    }

    this.calculate();
  }

  formatValue(value: string, input: HTMLInputElement) {
    input.value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }

  simpleFormatValue(value: number) {
    if (Number.isNaN(value) || value == 0) {
      return "0";
    }
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }

  private saveData() {
    if (this.actualLevel != null) {
      localStorage.setItem("psycho-calc-actual-level", this.actualLevel);
    }
    localStorage.setItem("psycho-calc-cost", String(this.cost));
    localStorage.setItem("psycho-calc-earn", String(this.earn));
    localStorage.setItem("psycho-calc-percent", String(this.percent));
    localStorage.setItem("psycho-calc-time", String(this.time));
  }

  private loadData() {
    let actualLevel = localStorage.getItem("psycho-calc-actual-level");

    if (actualLevel != null) {
      this.actualLevel = actualLevel;
    }

    let cost = localStorage.getItem("psycho-calc-cost");
    let earn = localStorage.getItem("psycho-calc-earn");
    let percent = localStorage.getItem("psycho-calc-percent");
    let time = localStorage.getItem("psycho-calc-time");

    if (cost != null && cost != "0" && cost != "NaN") {
      this.inputCost.nativeElement.value = cost;
      this.cost = parseInt(cost);
    }
    if (earn != null && earn != "0" && earn != "NaN") {
      this.inputEarn.nativeElement.value = earn;
      this.earn = parseInt(earn);
    }
    if (percent != null && percent != "0" && percent != "NaN") {
      this.inputPercent.nativeElement.value = percent;
      this.percent = parseInt(percent);
    }
    if (time != null && time != "0" && time != "NaN") {
      this.inputTime.nativeElement.value = time;
      this.time = parseInt(time);
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.saveData();
  }

}

/*,
{rank: 2, levels: [
  {level: 1, startExpSum: 0, endExpSum: 100},
  {level: 2, startExpSum: 100, endExpSum: 300},
  {level: 3, startExpSum: 300, endExpSum: 600},
  {level: 4, startExpSum: 600, endExpSum: 1200},
  {level: 5, startExpSum: 1200, endExpSum: 2080},
  {level: 6, startExpSum: 2080, endExpSum: 5000},
  {level: 7, startExpSum: 5000, endExpSum: 20000},
  {level: 8, startExpSum: 20000, endExpSum: 20000}
]},
{rank: 3, levels: [
  {level: 1, startExpSum: 0, endExpSum: 200},
  {level: 2, startExpSum: 200, endExpSum: 600},
  {level: 3, startExpSum: 600, endExpSum: 1200},
  {level: 4, startExpSum: 1200, endExpSum: 2400},
  {level: 5, startExpSum: 2400, endExpSum: 4160},
  {level: 6, startExpSum: 4160, endExpSum: 10000},
  {level: 7, startExpSum: 10000, endExpSum: 40000},
  {level: 8, startExpSum: 40000, endExpSum: 40000}
]},
{rank: 4, levels: [
  {level: 1, startExpSum: 0, endExpSum: 300},
  {level: 2, startExpSum: 300, endExpSum: 900},
  {level: 3, startExpSum: 900, endExpSum: 1800},
  {level: 4, startExpSum: 1800, endExpSum: 3600},
  {level: 5, startExpSum: 3600, endExpSum: 6240},
  {level: 6, startExpSum: 6240, endExpSum: 15000},
  {level: 7, startExpSum: 15000, endExpSum: 60000},
  {level: 8, startExpSum: 60000, endExpSum: 60000}
]},
{rank: 5, levels: [
  {level: 1, startExpSum: 0, endExpSum: 400},
  {level: 2, startExpSum: 400, endExpSum: 1200},
  {level: 3, startExpSum: 1200, endExpSum: 2400},
  {level: 4, startExpSum: 2400, endExpSum: 4800},
  {level: 5, startExpSum: 4800, endExpSum: 8320},
  {level: 6, startExpSum: 8320, endExpSum: 20000},
  {level: 7, startExpSum: 20000, endExpSum: 80000},
  {level: 8, startExpSum: 80000, endExpSum: 80000}
]},
{rank: 6, levels: [
  {level: 1, startExpSum: 0, endExpSum: 500},
  {level: 2, startExpSum: 500, endExpSum: 1500},
  {level: 3, startExpSum: 1500, endExpSum: 3000},
  {level: 4, startExpSum: 3000, endExpSum: 6000},
  {level: 5, startExpSum: 6000, endExpSum: 10400},
  {level: 6, startExpSum: 10400, endExpSum: 25000},
  {level: 7, startExpSum: 25000, endExpSum: 100000},
  {level: 8, startExpSum: 100000, endExpSum: 100000}
]},
{rank: 7, levels: [
  {level: 1, startExpSum: 0, endExpSum: 600},
  {level: 2, startExpSum: 600, endExpSum: 1800},
  {level: 3, startExpSum: 1800, endExpSum: 3600},
  {level: 4, startExpSum: 3600, endExpSum: 7200},
  {level: 5, startExpSum: 7200, endExpSum: 12480},
  {level: 6, startExpSum: 12480, endExpSum: 30000},
  {level: 7, startExpSum: 30000, endExpSum: 120000},
  {level: 8, startExpSum: 120000, endExpSum: 120000}
]},
{rank: 8, levels: [
  {level: 1, startExpSum: 0, endExpSum: 700},
  {level: 2, startExpSum: 700, endExpSum: 2100},
  {level: 3, startExpSum: 2100, endExpSum: 4200},
  {level: 4, startExpSum: 4200, endExpSum: 8400},
  {level: 5, startExpSum: 8400, endExpSum: 14560},
  {level: 6, startExpSum: 14560, endExpSum: 35000},
  {level: 7, startExpSum: 35000, endExpSum: 140000},
  {level: 8, startExpSum: 140000, endExpSum: 140000}
]},
{rank: 9, levels: [
  {level: 1, startExpSum: 0, endExpSum: 800},
  {level: 2, startExpSum: 800, endExpSum: 2400},
  {level: 3, startExpSum: 2400, endExpSum: 4800},
  {level: 4, startExpSum: 4800, endExpSum: 9600},
  {level: 5, startExpSum: 9600, endExpSum: 16640},
  {level: 6, startExpSum: 16640, endExpSum: 40000},
  {level: 7, startExpSum: 40000, endExpSum: 160000},
  {level: 8, startExpSum: 160000, endExpSum: 160000}
]},
{rank: 10,  levels: [
  {level: 1, startExpSum: 0, endExpSum: 1000},
  {level: 2, startExpSum: 1000, endExpSum: 3000},
  {level: 3, startExpSum: 3000, endExpSum: 6000},
  {level: 4, startExpSum: 6000, endExpSum: 12000},
  {level: 5, startExpSum: 12000, endExpSum: 20800},
  {level: 6, startExpSum: 20800, endExpSum: 50000},
  {level: 7, startExpSum: 50000, endExpSum: 200000},
  {level: 8, startExpSum: 200000, endExpSum: 200000}
]},
{rank: 11, levels: [
  {level: 1, startExpSum: 0, endExpSum: 1000},
  {level: 2, startExpSum: 1000, endExpSum: 3000},
  {level: 3, startExpSum: 3000, endExpSum: 6000},
  {level: 4, startExpSum: 6000, endExpSum: 12000},
  {level: 5, startExpSum: 12000, endExpSum: 20800},
  {level: 6, startExpSum: 20800, endExpSum: 50000},
  {level: 7, startExpSum: 50000, endExpSum: 200000},
  {level: 8, startExpSum: 200000, endExpSum: 200000}
]},
{rank: 12, levels: [
  {level: 1, startExpSum: 0, endExpSum: 1000},
  {level: 2, startExpSum: 1000, endExpSum: 3000},
  {level: 3, startExpSum: 3000, endExpSum: 6000},
  {level: 4, startExpSum: 6000, endExpSum: 12000},
  {level: 5, startExpSum: 12000, endExpSum: 20800},
  {level: 6, startExpSum: 20800, endExpSum: 50000},
  {level: 7, startExpSum: 50000, endExpSum: 200000},
  {level: 8, startExpSum: 200000, endExpSum: 200000}
]}*/

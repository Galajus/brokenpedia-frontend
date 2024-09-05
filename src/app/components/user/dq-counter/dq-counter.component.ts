import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {DqCounterService} from "@services/user/dq-counter/dq-counter.service";

@Component({
  selector: 'app-dq-counter',
  templateUrl: './dq-counter.component.html',
  styleUrls: ['./dq-counter.component.scss']
})
export class DqCounterComponent implements OnInit {

  countDowns$: Observable<{ dq: String, days: number, hours: number, minutes: number, seconds: number }>[] = [];


  constructor(
    private countdownService: DqCounterService
  ) {}

  ngOnInit(): void {
    this.countDowns$.push(this.countdownService.getCountdown7Days());
    this.countDowns$.push(this.countdownService.getCountdown3Days());
    this.countDowns$.push(this.countdownService.getCountdown2Days());
    this.countDowns$.push(this.countdownService.getCountdown1Days());
  }

}

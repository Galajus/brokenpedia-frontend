import {Injectable} from '@angular/core';
import {BehaviorSubject, interval} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DqCounterService {

  private readonly initialTimestamp: number;
  private targetDate7Days!: number;
  private targetDate3Days!: number;
  private targetDate2Days!: number;
  private targetDate1Days!: number;
  private countdown7Days$ = new BehaviorSubject<{ dq: string, days: number, hours: number, minutes: number, seconds: number }>({
    dq: "Weekly | Aqua | Selena:",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  private countdown3Days$ = new BehaviorSubject<{ dq: string, days: number, hours: number, minutes: number, seconds: number }>({
    dq: "Raki | Pokusa Selene:",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  private countdown2Days$ = new BehaviorSubject<{ dq: string, days: number, hours: number, minutes: number, seconds: number }>({
    dq: "Obręcze:",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  private countdown1Days$ = new BehaviorSubject<{ dq: string, days: number, hours: number, minutes: number, seconds: number }>({
    dq: "Dzienne:",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });


  constructor() {
    this.initialTimestamp = 1717380000; // begin date
    this.setTargetDate();
    this.startCountdown(this.targetDate7Days, this.countdown7Days$);
    this.startCountdown(this.targetDate3Days, this.countdown3Days$);
    this.startCountdown(this.targetDate2Days, this.countdown2Days$);
    this.startCountdown(this.targetDate1Days, this.countdown1Days$);
  }

  private setTargetDate() {
    const now = Math.floor(Date.now() / 1000);
    const timeElapsed = now - this.initialTimestamp;
    const daysElapsed = Math.floor(timeElapsed / (60 * 60 * 24));

    const cyclesElapsed7Days = Math.floor(daysElapsed / 7);
    //const nextCycleStartDate7Days = new Date(this.initialDate);
    const cyclesElapsed3Days = Math.floor(daysElapsed / 3);
    //const nextCycleStartDate3Days = new Date(this.initialDate);
    const cyclesElapsed2Days = Math.floor(daysElapsed / 2);
    //const nextCycleStartDate2Days = new Date(this.initialDate);
    const cyclesElapsed1Days = Math.floor(daysElapsed);
    //const nextCycleStartDate1Days = new Date(this.initialDate);
    /*nextCycleStartDate7Days.setDate(this.initialDate.getDate() + (cyclesElapsed7Days + 1) * 7);
    nextCycleStartDate3Days.setDate(this.initialDate.getDate() + (cyclesElapsed3Days + 1) * 3);
    nextCycleStartDate2Days.setDate(this.initialDate.getDate() + (cyclesElapsed2Days + 1) * 2);
    nextCycleStartDate1Days.setDate(this.initialDate.getDate() + (cyclesElapsed1Days + 1));*/

    this.targetDate7Days = this.initialTimestamp + (cyclesElapsed7Days + 1) * 7 * 24 * 60 * 60;
    this.targetDate3Days = this.initialTimestamp + (cyclesElapsed3Days + 1) * 3 * 24 * 60 * 60;
    this.targetDate2Days = this.initialTimestamp + (cyclesElapsed2Days + 1) * 2 * 24 * 60 * 60;
    this.targetDate1Days = this.initialTimestamp + (cyclesElapsed1Days + 1) * 24 * 60 * 60;
  }

  private startCountdown(targetTimestamp: number, subject: BehaviorSubject<{ dq: string, days: number, hours: number, minutes: number, seconds: number }>) {
    interval(1000).subscribe(() => {
      const now = this.getPolandTimestamp();
      const timeDifference = targetTimestamp - now;
      const dq = subject.value.dq;
      if (timeDifference > 0) {
        const seconds = timeDifference % 60;
        const minutes = Math.floor((timeDifference / 60) % 60);
        const hours = Math.floor((timeDifference / (60 * 60)) % 24);
        const days = Math.floor(timeDifference / (60 * 60 * 24));
        subject.next({ dq, days, hours, minutes, seconds });
      } else {
        this.setTargetDate(); // Reset the target date
      }
    });
  }

  private getPolandTimestamp(): number {
    const nowUTC = Math.floor(Date.now() / 1000);
    const polandOffsetSeconds = this.getPolandOffset() * 60;
    return nowUTC + polandOffsetSeconds;
  }

  private getPolandOffset(date = new Date()): number {
    const options = { timeZone: "Europe/Warsaw" };
    return new Date(date.toLocaleString("en-US", options)).getTimezoneOffset();
  }

  getCountdown7Days() {
    return this.countdown7Days$.asObservable();
  }
  getCountdown3Days() {
    return this.countdown3Days$.asObservable();
  }
  getCountdown2Days() {
    return this.countdown2Days$.asObservable();
  }
  getCountdown1Days() {
    return this.countdown1Days$.asObservable();
  }
}

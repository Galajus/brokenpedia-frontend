import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'simpleDate',
    standalone: false
})
export class SimpleDate implements PipeTransform {
  transform(date: Date | undefined): string {
    if (!date) {
      return "27.08.2022 10:20";
    }
    let date1 = new Date(date);

    let day = date1.getDate().toString();
    if (date1.getDate() < 10) {
      day = "0" + date1.getDate();
    }
    let month = (date1.getMonth() + 1).toString();
    if (date1.getMonth() < 10) {
      month = "0" + (date1.getMonth() + 1);
    }
    let minutes = date1.getMinutes().toString();
    if (date1.getMinutes() < 10) {
      minutes = "0" + date1.getMinutes();
    }
    let hours = date1.getHours() + 2;
    if (hours === 24) {
      hours = 0;
    }
    if (hours === 25) {
      hours = 1;
    }

    //TODO TIMEZONE OF USER

    return day + "." + month + "." + date1.getFullYear() + " " + hours + ":" + minutes;
  }
}

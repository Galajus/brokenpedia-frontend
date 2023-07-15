import {Pipe, PipeTransform} from '@angular/core';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'simpleDate'})
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

    //TODO TIMEZONE OF USER

    return day + "." + month + "." + date1.getFullYear() + " " + (date1.getHours() + 2) + ":" + minutes;
  }
}

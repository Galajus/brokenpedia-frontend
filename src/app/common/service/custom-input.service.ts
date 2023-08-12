import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomInputService {

  constructor() { }

  /**
   * Format input to put space between every 3 digits
   * @param event
   * @return Number value of formatted string
   */
  formatInput(event: Event) {
    let target = event.target as HTMLInputElement;
    //GETTING SELECTIONS - CARET POSITION AND VALIDATE
    //GETTING OLD FORMATTED VALUE
    let workValue = target.value;
    let selectionEnd = target.selectionEnd;
    let selectionStart = target.selectionStart;
    if (!selectionEnd || !selectionStart) {
      return Number.parseInt(workValue);
    }
    //GETTING SPACES OF OLD FORMATTED VALUE
    let oldSpacesSum = workValue.match(/ /g||[])?.length;
    if (!oldSpacesSum) {
      oldSpacesSum = 0;
    }
    //VALIDATE VALUE
    workValue = target.value.replace(/\D/g, "");
    //INSERTING SPACES EVERY THREE NUMBERS
    target.value = workValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    let readyValue = target.value;
    //GETTING SUM SPACES IN NEW TARGET VALUE
    let newSpacesSum = readyValue.match(/ /g||[])?.length;
    if (!newSpacesSum) {
      newSpacesSum = 0;
    }
    //PUSH NEW CARET POSITION
    let difference = newSpacesSum - oldSpacesSum;
    target.selectionStart = selectionStart + difference;
    target.selectionEnd = selectionEnd  + difference;
    return Number.parseInt(workValue);
  }

  stringAsNumber(string: string) {
    if (!string) {
      return 0;
    }
    return Number.parseInt(string.replace(/\D/g, ""));
  }

  insertSpacesEveryThree(workValue: string) {
    workValue = workValue.replace(/\D/g, "");
    return workValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }
}

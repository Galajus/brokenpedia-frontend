import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'underscore',
    standalone: false
})
export class Underscore implements PipeTransform {
  transform(value: string): string {
    return value? value.replace(/ /g, "_") : value;
  }
}

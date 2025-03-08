import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keyArray',
    standalone: false
})
export class KeyArrayPipe implements PipeTransform {

  transform(enumer: any): string[] {

      let keys: string[] = [];
      for (let key in enumer) {
        if (!this.isUpperCase(key) && isNaN(Number(key))) {
          keys.push(key);
        }
      }
      return keys;

  }

  isUpperCase(s: string): boolean {
    return s !== s.toUpperCase();
  }

}

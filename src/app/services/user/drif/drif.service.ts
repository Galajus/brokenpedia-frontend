import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Drif} from "@models/drif/drif";
import {environment} from "../../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DrifService {
  constructor(
    private http: HttpClient
  ) { }

  getAllDrifs(): Observable<Drif[]> {
    return this.http.get<Drif[]>(environment.endpoints.buildCalculator.getAllDrifs);
  }

  getDrifPower(startPower: number, level: number) {
    return startPower * this.getDrifLevelTier(level);
  }

  getDrifTierMultiplier(tier: number) {
    return tier == 1 ? 0 : tier == 2 ? 1 : tier == 3 ? 3 : tier >= 4 ? 5 : 0;
  }

  getDrifLevelTier(drifLevel: number) {
    if (drifLevel <= 6) {
      return 1;
    } else if (drifLevel <= 11) {
      return 2;
    } else if (drifLevel <= 16) {
      return 3;
    } else {
      return 4;
    }
  }

  countUsedPower(drif1: Drif | null, drif2: Drif | null, drif3: Drif | null, ornaments: number, itemRank: number) { //TODO: use in brokencalc
    let usedPower = 0;
    if (drif1) {
      usedPower += this.getDrifPower(drif1.startPower, drif1.level || 1);
    }
    if (drif2 && (itemRank >= 4 || ornaments >=7)) {
      usedPower += this.getDrifPower(drif2.startPower, drif2.level || 1);
    }
    if (drif3  && itemRank >= 10) {
      usedPower += this.getDrifPower(drif3.startPower, drif3.level || 1);
    }
    return usedPower;
  }
}

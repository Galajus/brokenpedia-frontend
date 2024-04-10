import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Drif} from "@models/drif/drif";
import {environment} from "../../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {DrifItem} from "@models/drif/drifItem";

@Injectable({
  providedIn: 'root'
})
export class DrifSimulatorService {
  constructor(
    private http: HttpClient
  ) { }

  getAllDrifs(): Observable<Drif[]> {
    return this.http.get<Drif[]>(environment.endpoints.buildCalculator.getAllDrifs);
  }

  remapDbDrifs(drifs: Drif[]) {
    return drifs.map(d => {
      return {
        tier: 1,
        level: 1,
        psychoMod: d.psychoMod,
        startPower: d.startPower,
        psychoGrowByLevel: d.psychoGrowByLevel,
        category: d.category,
        shortName: d.shortName
      } as DrifItem;
    });
  }

}

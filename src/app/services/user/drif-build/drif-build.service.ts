import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {DrifBuild} from "@models/drif/drifBuild";
import {DrifBuildDto} from "@models/drif/drifBuildDto";
import {RarWithDrifs} from "@models/drif/rarWithDrifs";
import {RarWithDrifsDto} from "@models/drif/rarWithDrifsDto";
import {DrifDto} from "@models/drif/drifDto";
import {Drif} from "@models/drif/drif";
import {InventorySlot} from "@models/build-calculator/inventory/inventorySlot";

@Injectable({
  providedIn: 'root'
})
export class DrifBuildService {

  rarWithDrifsSlotOrder: InventorySlot[] = [
    InventorySlot.WEAPON,
    InventorySlot.HELMET,
    InventorySlot.ARMOR,
    InventorySlot.PANTS,
    InventorySlot.BOOTS,
    InventorySlot.SHIELDORBRACES,
    InventorySlot.BELT,
    InventorySlot.CAPE,
    InventorySlot.GLOVES,
    InventorySlot.AMULET,
    InventorySlot.RING_1,
    InventorySlot.RING_2
  ]

  constructor(
    private http: HttpClient
  ) {
  }

  createBuild(build: DrifBuild): Observable<DrifBuildDto> {
    const drifBuildDto = this.mapDrifBuildToDrifBuildDto(build);
    return this.http.post<DrifBuildDto>("/api/profile/drif-builds", drifBuildDto);
  }

  updateBuild(build: DrifBuild): Observable<DrifBuildDto> {
    const drifBuildDto = this.mapDrifBuildToDrifBuildDto(build);
    return this.http.put<DrifBuildDto>("/api/profile/drif-builds", drifBuildDto);
  }

  deleteBUild(id: number): Observable<void> {
    return this.http.delete<void>("/api/profile/drif-builds/" + id);
  }

  getOwningBuilds(): Observable<DrifBuildDto[]> {
    return this.http.get<DrifBuildDto[]>("/api/profile/drif-builds");
  }

  sortRarWithDrifsBySlot(items: RarWithDrifs[]): RarWithDrifs[] {
    return items.sort((a, b) => {
      return this.rarWithDrifsSlotOrder.indexOf(a.slot) - this.rarWithDrifsSlotOrder.indexOf(b.slot);
    });
  }

  mapDrifBuildToDrifBuildDto(build: DrifBuild) {
    const rarDtos = this.mapRarWithDrifsToRarWithDrifsDto(build.rarsWithDrifs, build.id);
    const backpack = this.mapDrifToDrifDto(build.backpack, build.id);
    const mappedBuild: DrifBuildDto = {
      critEpicModLevel: build.critEpicModLevel ?? 1,
      dedicatedEpicModLevel: build.dedicatedEpicModLevel ?? 1,
      id: build.id,
      name: build.name,
      owner: build.owner,
      rarsWithDrifs: rarDtos,
      backpack: backpack,
    }
    return mappedBuild;
  }

  mapRarWithDrifsToRarWithDrifsDto(rars: RarWithDrifs[], buildId?: number) {
    const mappedRars: RarWithDrifsDto[] = [];

    rars.forEach(rar => {
      const drifsInRar = this.mapDrifToDrifDto(rar.drifItems, undefined, rar.id);

      const mappedRar: RarWithDrifsDto = {
        drifBuidId: buildId,
        epikBoost: rar.epikBoost,
        id: rar.id,
        ornaments: rar.ornaments,
        rank: rar.rank,
        sidragaBoost: rar.sidragaBoost,
        slot: rar.slot,
        drifItems: drifsInRar
      }
      mappedRars.push(mappedRar);
    });

    return mappedRars;
  }

  mapDrifToDrifDto(drifs: Drif[], buildId?: number, rarId?: number) {
    const mappedDrifs: DrifDto[] = [];

    drifs.forEach(drif => {
      const mappedDrif: DrifDto = {
        id: drif.dbId,
        drifBuildId: buildId,
        rarWithDrifsId: rarId,
        drifId: drif.id,
        drifSlot: drif.drifSlot,
        level: drif.level ?? 1,
        tier: drif.tier ?? 1
      };
      mappedDrifs.push(mappedDrif);
    });

    return mappedDrifs;
  }
}

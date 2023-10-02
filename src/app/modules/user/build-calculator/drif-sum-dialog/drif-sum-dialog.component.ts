import {Component, Inject, OnInit} from '@angular/core';
import {ModSummary} from "../../drif-simulator/model/modSummary";
import {PsychoMod} from "../../../../common/model/psychoMod";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DrifCategory} from "../../../../common/model/drif/drifCategory";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-drif-sum-dialog',
  templateUrl: './drif-sum-dialog.component.html',
  styleUrls: ['./drif-sum-dialog.component.scss']
})
export class DrifSumDialogComponent implements OnInit {

  modSummary: ModSummary[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private translateService: TranslateService
  ) {
    this.modSummary = data.summary;
  }

  ngOnInit(): void {
  }

  getModSummaryByCategory(modSummary: ModSummary[], category: DrifCategory) {
    let modSummaries = modSummary.filter(sum => {
      let cat = DrifCategory[sum.category as keyof typeof DrifCategory];
      return cat === category.valueOf()
    })
      .sort((a, b) => a.mod.localeCompare(b.mod));
    return modSummaries;
  }

  prepareModSummaryRow(summary: ModSummary): string {
    let row;
    if (summary.mod === PsychoMod.EXTRA_AP) {
      const indexOfS = Object.values(PsychoMod).indexOf(summary.mod as unknown as PsychoMod);
      const mod = Object.keys(PsychoMod)[indexOfS];
      row = summary.amountDrifs + "x " + this.translateService.instant('PSYCHO_EFFECTS.' + mod) + ": " + summary.modSum;
    } else {
      if (summary.reducedPercent) {
        row = summary.amountDrifs + "x " + this.translateService.instant('PSYCHO_EFFECTS.' + summary.mod) + ': <u title="' + summary.reducedPercent + '% sumy efektu -' + summary.reducedValue?.toFixed(2) + '%">' + summary.modSum.toFixed(2) + "%</u>";
      } else {
        row = summary.amountDrifs + "x " + this.translateService.instant('PSYCHO_EFFECTS.' + summary.mod) + ": " + summary.modSum.toFixed(2) + "%";
      }
    }

    if (summary.max) {
      row = row + " (max: " + summary.max + "%)";
    }
    row = row + " [" + summary.drifName + "] ";
    return row;
  }

  protected readonly DrifCategory = DrifCategory;
}

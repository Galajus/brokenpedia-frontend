import {Component, Inject, OnInit} from '@angular/core';
import {ModSummary} from "@models/drif/modSummary";
import {TranslateService} from "@ngx-translate/core";
import {DrifCategory} from "@models/drif/drifCategory";
import {PsychoMod} from "@models/items/psychoMod";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    selector: 'app-drif-sum-dialog',
    templateUrl: './drif-sum-dialog.component.html',
    styleUrls: ['./drif-sum-dialog.component.scss'],
    standalone: false
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
    return modSummary.filter(sum => sum.category === category)
      .sort((a, b) => a.mod.localeCompare(b.mod));
  }

  prepareModSummaryRow(summary: ModSummary): string {
    let row;
    if (summary.mod === PsychoMod.EXTRA_AP) {
      row = summary.amountDrifs + "x " + this.translateService.instant('PSYCHO_EFFECTS.' + summary.mod) + ": " + summary.modSum;
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

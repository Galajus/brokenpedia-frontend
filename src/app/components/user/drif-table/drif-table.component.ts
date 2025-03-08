import {Component, OnInit, ViewChild} from '@angular/core';
import {DrifService} from "@services/user/drif/drif.service";
import {Drif} from "@models/drif/drif";
import {MatSort} from "@angular/material/sort";
import {TableDrif} from "@models/drif/tableDrif";
import {cloneDeep, round} from "lodash-es";
import {DrifCategory} from "@models/drif/drifCategory";
import {DrifPresentation} from "@models/drif-table/drifPresentation";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-drif-table',
    templateUrl: './drif-table.component.html',
    styleUrls: ['./drif-table.component.scss'],
    standalone: false
})
export class DrifTableComponent implements OnInit {

  displayedColumns: string[] = [
    "image",
    "drif-name",
    "category",
    "modificator",
    "power",
    "modValue"
  ];

  hideDisabled = true;
  drifCategorySelectPresentation: DrifPresentation[] = [
    {
      drifCategory: DrifCategory.REDUCTION,
      drifName: "alorn",
      enabled: true
    },
    {
      drifCategory: DrifCategory.ACCURACY,
      drifName: "dur",
      enabled: true
    },
    {
      drifCategory: DrifCategory.DEFENCE,
      drifName: "grod",
      enabled: true
    },
    {
      drifCategory: DrifCategory.DAMAGE,
      drifName: "band",
      enabled: true
    },
    {
      drifCategory: DrifCategory.SPECIAL,
      drifName: "lun",
      enabled: true
    }
  ]

  drifTier: number = 1;
  drifLevel: number = 1;

  fallbackDrifs!: Drif[];
  dataSource!: MatTableDataSource<TableDrif>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private drifService: DrifService,
  ) { }

  ngOnInit(): void {
    this.drifService.getAllDrifs()
      .subscribe(drifs => {
        const tableDrifs = drifs.map(d => {
          const tableDrif: TableDrif = {
            ...d
          };
          return tableDrif;
        });
        this.fallbackDrifs = tableDrifs;
        this.dataSource = new MatTableDataSource<TableDrif>(tableDrifs);
        this.dataSource.sort = this.sort;
        this.calculateDrifsValues();
      });
  }

  calculateDrifsValues(): void {
    this.setMaxDrifLevel();

    this.filterTable();

    const tableDrifs = this.dataSource.data;
    tableDrifs.forEach(d => {
      d.modValue = round(this.getModValue(d), 2);
      d.power = this.drifService.getDrifPower(d.startPower, this.drifLevel);
    });
  }

  setMaxDrifLevel(): void {
    if (this.drifTier === 1 && this.drifLevel > 6) {
      this.drifLevel = 6;
    }
    if (this.drifTier === 2 && this.drifLevel > 11) {
      this.drifLevel = 11;
    }
    if (this.drifTier === 3 && this.drifLevel > 16) {
      this.drifLevel = 16;
    }
  }

  get power() {
    return 1;
  }

  getModValue(drif: Drif) {
    let toAdd = this.drifLevel * drif.psychoGrowByLevel;
    toAdd += drif.psychoGrowByLevel * this.drifService.getDrifTierMultiplier(this.drifTier);
    if (this.drifTier === 4 && this.drifLevel >= 19) {
      toAdd += (this.drifLevel - 18) * drif.psychoGrowByLevel;
    }
    return toAdd;
  }

  changeDrifLevel(e: Event) {
    const t = e.target as HTMLInputElement;
    if (t.value) {
      this.drifLevel = t.valueAsNumber;
      this.calculateDrifsValues();
    }
  }

  get tierName() {
      switch (this.drifTier) {
        case 1: {
          return "sub";
        }
        case 2: {
          return "bi";
        }
        case 3: {
          return "magni";
        }
        case 4: {
          return "arcy";
        }
        default: {
          return "sub";
        }
      }
  }

  filterTable() {
    let newTableDrifs: Drif[] = cloneDeep(this.fallbackDrifs);
    if (this.hideDisabled) {
      newTableDrifs = newTableDrifs.filter(d => !d.forRemoval);
    }

    const enabledDrifPresentations = this.drifCategorySelectPresentation.filter(d => d.enabled);
    const drifCategories = enabledDrifPresentations.map(d => d.drifCategory);
    newTableDrifs = newTableDrifs.filter(d => drifCategories.includes(d.category));

    this.dataSource.data = newTableDrifs;
  }

  changeDrifEnabled(d: DrifPresentation) {
    d.enabled = !d.enabled;

    this.calculateDrifsValues();
  }
}

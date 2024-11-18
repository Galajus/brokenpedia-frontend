import {AfterViewInit, Component} from '@angular/core';
import {DrifsService} from "@services/admin/drifs/drifs.service";
import {Drif} from "@models/drif/drif";

@Component({
  selector: 'app-drifs',
  templateUrl: './drifs.component.html',
  styleUrls: ['./drifs.component.scss']
})
export class DrifsComponent implements AfterViewInit {

  textToRead: string = "";
  displayedColumns: string[] = ["id", "name", "shortName", "psychoGrowByLevel", "category", "startPower", "actions"];
  dataSource: Drif[] = [];

  constructor(private drifsService: DrifsService) { }

  ngAfterViewInit(): void {
    this.drifsService.getAllDrifs()
      .subscribe(d => {
        this.dataSource = d;
      })
  }

  read() {
    let parse: any = JSON.parse(this.textToRead);
    let drifs = parse as Drif[];
    this.drifsService.saveAllDrifsFromJson(drifs)
      .subscribe(r => {
        console.log("SAVED")
      })
  }

  deleteDrif(id: number) {
    this.drifsService.deleteDrif(id)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(d => d.id !== id);
      })
  }

}

import {Component, OnInit} from '@angular/core';
import {Drif} from "../../../common/model/drif/drif";
import {DrifsService} from "./drifs.service";

@Component({
  selector: 'app-drifs',
  templateUrl: './drifs.component.html',
  styleUrls: ['./drifs.component.scss']
})
export class DrifsComponent implements OnInit {

  textToRead: string = "";

  constructor(private drifsService: DrifsService) { }

  ngOnInit(): void {
  }

  read() {
    let parse: any = JSON.parse(this.textToRead);
    let drifs = parse as Drif[];
    this.drifsService.saveAllDrifsFromJson(drifs)
      .subscribe(r => {
        console.log("SAVED")
      })
  }

}

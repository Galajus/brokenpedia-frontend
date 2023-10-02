import {Component, OnInit} from '@angular/core';
import {Orb} from "../../../common/model/orb/orb";
import {OrbsService} from "./orbs.service";

@Component({
  selector: 'app-orbs',
  templateUrl: './orbs.component.html',
  styleUrls: ['./orbs.component.scss']
})
export class OrbsComponent implements OnInit {

  textToRead: string = "";

  constructor(private orbsService: OrbsService) { }

  ngOnInit(): void {
  }

  read() {
    let parse: any = JSON.parse(this.textToRead);
    let orbs = parse as Orb[];
    this.orbsService.saveAllOrbsFromJson(orbs)
      .subscribe(r => {
        console.log("SAVED")
      })
  }

}

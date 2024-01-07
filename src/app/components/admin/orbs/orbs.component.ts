import {Component, OnInit} from '@angular/core';
import {OrbsService} from "../../../services/admin/orbs/orbs.service";
import {Orb} from "../../../models/orb/orb";

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

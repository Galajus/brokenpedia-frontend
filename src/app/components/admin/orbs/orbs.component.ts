import {AfterViewInit, Component} from '@angular/core';
import {OrbsService} from "@services/admin/orbs/orbs.service";
import {Orb} from "@models/orb/orb";

@Component({
    selector: 'app-orbs',
    templateUrl: './orbs.component.html',
    styleUrls: ['./orbs.component.scss'],
    standalone: false
})
export class OrbsComponent implements AfterViewInit {

  textToRead: string = "";
  displayedColumns: string[] = ["id", "shortName", "type", "startBonus", "effect", "actions"];
  dataSource: Orb[] = [];

  constructor(private orbsService: OrbsService) { }

  ngAfterViewInit(): void {
    this.orbsService.getAllOrbs()
      .subscribe(data => this.dataSource = data);
  }

  read() {
    let parse: any = JSON.parse(this.textToRead);
    let orbs = parse as Orb[];
    this.orbsService.saveAllOrbsFromJson(orbs)
      .subscribe(r => {
        console.log("SAVED")
      })
  }

  deleteOrb(id: number) {
    this.orbsService.deleteOrb(id)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(o => o.id !== id);
      })
  }
}

import {AfterViewInit, Component} from '@angular/core';
import {SetService} from "@services/admin/set/set.service";
import {ItemSet} from "@models/set/itemSet";

@Component({
    selector: 'app-sets',
    templateUrl: './sets.component.html',
    styleUrls: ['./sets.component.scss'],
    standalone: false
})
export class SetsComponent implements AfterViewInit {

  displayedColumns: string[] = ["id", "name", "actions"];
  dataSource: ItemSet[] = [];

  constructor(private setService: SetService) { }

  ngAfterViewInit(): void {
    this.setService.getAllSets()
      .subscribe(data => this.dataSource = data);
  }


  deleteItem(id: number) {
    this.setService.deleteSetById(id)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(i => {
          return i.id !== id;
        });
      })
  }

}

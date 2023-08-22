import {AfterViewInit, Component} from '@angular/core';
import {LegendaryItem} from "../../../common/model/items/legendaryItem";
import {InventoryService} from "./inventory.service";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements AfterViewInit {

  displayedColumns: string[] = ["id", "name", "actions"];
  dataSource: LegendaryItem[] = [];

  constructor(
    private inventoryService: InventoryService
  ) { }

  ngAfterViewInit(): void {
    this.inventoryService.getItems()
      .subscribe(data => this.dataSource = data);
  }


  deleteItem(id: number) {
    this.inventoryService.deleteItem(id)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(i => {
          return i.id !== id;
        });
      })
  }
}

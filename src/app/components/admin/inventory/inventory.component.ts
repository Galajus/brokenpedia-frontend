import {AfterViewInit, Component} from '@angular/core';
import {InventoryService} from "../../../services/admin/inventory/inventory.service";
import {LegendaryItem} from "../../../models/items/legendaryItem";

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

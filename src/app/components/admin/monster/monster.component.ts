import {AfterViewInit, Component} from '@angular/core';
import {MonsterService} from "@services/admin/monsters/monster.service";
import {Monster} from "@models/gameentites/monster";

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.scss']
})
export class MonsterComponent implements AfterViewInit {

  displayedColumns: string[] = ["id", "name", "type", "actions"];
  dataSource: Monster[] = [];
  constructor(
    private monsterService: MonsterService
  ) { }

  ngAfterViewInit(): void {
    this.monsterService.getAllMonsters()
      .subscribe(data => this.dataSource = data);
  }

  deleteMonster(id: number) {
    this.monsterService.deleteMonster(id)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(m => {
          return m.id !== id;
        });
      })
  }

}

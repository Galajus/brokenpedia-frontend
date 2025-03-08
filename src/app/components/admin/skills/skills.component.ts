import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Skill} from "@models/skills/skill";
import {SkillsService} from "@services/admin/skills/skills.service";
import {MatTable} from "@angular/material/table";

@Component({
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.scss'],
    standalone: false
})
export class SkillsComponent implements AfterViewInit {

  @ViewChild(MatTable) table!: MatTable<any>;

  displayedColumns: string[] = ["image", "id", "name", "actions"];
  dataSource: Skill[] = []; //TO DO ADD SKILL TO COMMON
  constructor(private skillsService: SkillsService) { }

  ngAfterViewInit(): void {
    this.skillsService.getSkills()
      .subscribe(data => this.dataSource = data);
  }

}

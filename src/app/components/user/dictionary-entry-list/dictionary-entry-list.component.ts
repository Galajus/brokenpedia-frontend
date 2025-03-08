import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DictionaryEntry} from "@models/dictionary/dictionaryEntry";
import {DictionaryService} from "@services/user/dictionary/dictionary.service";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-dictionary-entry-list',
    templateUrl: './dictionary-entry-list.component.html',
    styleUrls: ['./dictionary-entry-list.component.scss'],
    standalone: false
})
export class DictionaryEntryListComponent implements AfterViewInit {

  displayedColumns: string[] = ['entry', 'description'];
  dataSource!: MatTableDataSource<DictionaryEntry>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dictionaryService: DictionaryService
  ) { }

  ngAfterViewInit(): void {
    this.initData();
  }

  initData(): void {
    this.dictionaryService.getAllDictionaryEntry().subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource<DictionaryEntry>(data);

        this.dataSource.filterPredicate = (data: DictionaryEntry, filter: string) => {
          const normalizedFilter = this.normalize(filter);
          return this.normalize(data.entry).toLowerCase().includes(normalizedFilter);
        };

        this.dataSource.sort = this.sort;
        this.sort.sort({ id: 'entry', start: 'asc', disableClear: false });
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  normalize(text: String): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };
}

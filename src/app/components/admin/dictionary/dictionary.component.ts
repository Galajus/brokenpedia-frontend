import {AfterViewInit, Component} from '@angular/core';
import {DictionaryService} from "@services/admin/dictionary/dictionary.service";
import {MatDialog} from "@angular/material/dialog";
import {DictionaryEntry} from "@models/dictionary/dictionaryEntry";
import {MatSnackBar} from "@angular/material/snack-bar";
import {clone} from "lodash-es";

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements AfterViewInit {

  currentChangingId: number = 0;
  isChangingEntry: boolean = false;
  isChangingDescription: boolean = false;
  newEntry: String = "";
  newDescription: String = "";
  createEntry: String = "";
  createDescription: String = "";

  dictionaryEntries: DictionaryEntry[] = [];

  constructor(
    private dictionaryService: DictionaryService,
    private snackBar: MatSnackBar
  ) {
  }

  ngAfterViewInit(): void {
    this.initData();
  }

  initData(): void {
    this.dictionaryService.getAllDictionaryEntry().subscribe({
      next: data => {
        this.dictionaryEntries = data;
      }
    });
  }

  deleteEntry(id: number) {
    this.dictionaryService.deleteDictionaryEntry(id).subscribe(() => {
      this.dictionaryEntries = this.dictionaryEntries.filter(i => {
        return i.id !== id;
      });
    });
  }

  changeEntry(id: number) {
    const entry = this.dictionaryEntries.find(entry => entry.id === id);

    if (!entry) {
      throw new Error("Can't find entry for entry");
    }
    if (this.currentChangingId === id && this.isChangingEntry) {
      this.isChangingEntry = false;

      const clonedEdit = clone(this.newEntry);

      if (entry.description !== clonedEdit) {
        this.dictionaryService.patchDictionaryEntryEntry(id, clonedEdit)
          .subscribe({
            next: data => {
              this.snackBar.open("Zapisano entry <3", "ok", {duration: 2000});
            },
            error: err => {
              this.snackBar.open("NIE MOŻNA BYŁO ZAPISAĆ entry!", "ok", {duration: 2000});
            },
            complete: () => {
              entry.entry = clonedEdit;
            }
          })
      }
      this.isChangingEntry = false;
      this.currentChangingId = 0;
      this.newEntry = "";
      return;
    }

    this.currentChangingId = id;
    this.isChangingEntry = true;
    this.newEntry = entry.entry;
  }

  changeDescription(id: number) {
    const entry = this.dictionaryEntries.find(entry => entry.id === id);

    if (!entry) {
      throw new Error("Can't find entry for description");
    }
    if (this.currentChangingId === id && this.isChangingDescription) {
      this.isChangingDescription = false;

      const clonedEdit = clone(this.newDescription);

      if (entry.entry !== clonedEdit) {
        this.dictionaryService.patchDictionaryEntryDescription(id, clonedEdit)
          .subscribe({
            next: data => {
              this.snackBar.open("Zapisano description <3", "ok", {duration: 2000});
            },
            error: err => {
              this.snackBar.open("NIE MOŻNA BYŁO ZAPISAĆ description!", "ok", {duration: 2000});
            },
            complete: () => {
              entry.description = clonedEdit;
            }
          })
      }
      this.isChangingDescription = false;
      this.currentChangingId = 0;
      this.newDescription = "";
      return;
    }

    this.currentChangingId = id;
    this.isChangingDescription = true;
    this.newDescription = entry.description;
  }

  saveNewEntry() {
    if (this.createEntry.length === 0 || this.createDescription.length === 0) {
      this.snackBar.open("Pola nie mogą być puste!", "ok", {duration: 2000});
      return;
    }
    const newEntry: DictionaryEntry = {
      entry: this.createEntry,
      description: this.createDescription
    } as DictionaryEntry;
    this.dictionaryService.createDictionaryEntry(newEntry)
      .subscribe({
        next: data => {
          this.dictionaryEntries.push(data);
          this.snackBar.open("Zapisano nowe!", "ok", {duration: 2000});
          this.createEntry = "";
          this.createDescription = "";
        },
        error: err => {
          this.snackBar.open("Coś się rypło :c", "ok", {duration: 2000});
        }
      })
  }

}

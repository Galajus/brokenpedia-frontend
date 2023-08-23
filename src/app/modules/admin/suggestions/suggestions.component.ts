import {AfterViewInit, Component} from '@angular/core';
import {Suggestion} from "../../../common/model/suggestion/suggestion";
import {SuggestionsService} from "./suggestions.service";

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements AfterViewInit {

  displayedColumns: string[] = ["id", "type", "author", "suggestion", "actions"];
  suggestions: Suggestion[] = [];
  constructor(
    private suggestionService: SuggestionsService
  ) { }

  ngAfterViewInit(): void {
    this.suggestionService.getSuggestions()
      .subscribe(s => this.suggestions = s);
  }

  deleteItem(id: number) {
    this.suggestionService.deleteSuggestion(id)
      .subscribe(() => {
        this.suggestions = this.suggestions.filter(i => {
          return i.id !== id;
        });
      })
  }

}

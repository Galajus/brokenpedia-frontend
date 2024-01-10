import {AfterViewInit, Component} from '@angular/core';
import {SuggestionsService} from "@services/admin/suggestions/suggestions.service";
import {MatDialog} from "@angular/material/dialog";
import {EditAdminCommentComponent} from "./edit-admin-comment/edit-admin-comment.component";
import {Suggestion} from "@models/suggestion/suggestion";
import {SuggestionStatus} from "@models/suggestion/suggestionStatus";

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements AfterViewInit {

  protected readonly SuggestionStatus = SuggestionStatus;

  displayedColumns: string[] = ["id", "type", "author", "suggestion", "actions"];
  suggestions: Suggestion[] = [];
  constructor(
    private suggestionService: SuggestionsService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.suggestionService.getSuggestions()
      .subscribe(s => {
        this.suggestions = s;
      });
  }

  deleteItem(id: number) {
    this.suggestionService.deleteSuggestion(id)
      .subscribe(() => {
        this.suggestions = this.suggestions.filter(i => {
          return i.id !== id;
        });
      })
  }

  changeStatus(value: SuggestionStatus, suggestionId: number) {
    this.suggestionService.changeSuggestionStatus(suggestionId, value)
      .subscribe(() => {})
  }

  openAdminCommentDialog(suggestion: Suggestion) {
    let comment = suggestion.adminComment;
    if (!comment) {
      comment = "";
    }
    let matDialogRef = this.dialog.open(EditAdminCommentComponent, {
      width: '1000px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      data: {
        comment: comment
      }
    });

    matDialogRef.afterClosed()
      .subscribe((data) => {
        if (data) {
          if (comment != data.comment) {
            this.suggestionService.changeSuggestionAdminComment(suggestion.id, data.comment)
              .subscribe(() => {
                suggestion.adminComment = data.comment;
              })

          }
        }
      })

  }
}

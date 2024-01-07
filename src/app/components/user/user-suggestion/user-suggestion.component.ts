import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserSuggestionService} from "../../../services/user/suggestions/user-suggestion.service";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {SuggestionStatus} from "../../../models/suggestion/suggestionStatus";
import {SuggestionType} from "../../../models/suggestion/suggestionType";
import {Suggestion} from "../../../models/suggestion/suggestion";

@Component({
  selector: 'app-user-suggestion',
  templateUrl: './user-suggestion.component.html',
  styleUrls: ['./user-suggestion.component.scss']
})
export class UserSuggestionComponent implements OnInit {

  protected readonly SuggestionType = SuggestionType;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    sanitize: false,
    height: 'auto',
    minHeight: '450',
    maxHeight: 'auto',
    width: '800',
    minWidth: '800',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Wszystko co pomoże w ulepszeniu pedii! :D',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '',
  };

  @Input() suggestionForm!: FormGroup;
  success: boolean = false;
  error: boolean = false;
  sendSuggestionError: boolean = false;
  sendingSuggestion: boolean = false;
  suggestionsToShow!: Suggestion[];

  constructor(
    private formBuilder: FormBuilder,
    private userSuggestionService: UserSuggestionService
  ) {
  }

  ngOnInit(): void {
    this.suggestionForm = this.formBuilder.group({
      author: ['', [Validators.minLength(3), Validators.maxLength(18), Validators.required]],
      type: ['' ,[Validators.required]],
      suggestion: ['', [Validators.minLength(15), Validators.maxLength(5000), Validators.required]]
    })
  }

  saveSuggestion() {
    if (this.suggestionForm.invalid) {
      this.sendSuggestionError = true;
      return;
    }

    this.sendingSuggestion = true;
    let suggestion = this.suggestionForm.value as Suggestion;
    this.sendSuggestionError = false;
    this.userSuggestionService.saveSuggestion(suggestion)
      .subscribe({
          next: value => this.success = true,
          error: err => this.error = true
        }
      );
  }

    protected readonly SuggestionStatus = SuggestionStatus;

  showSuggestions(suggestionsStatus: string) {
    this.userSuggestionService.getSuggestionsByStatus(suggestionsStatus)
      .subscribe(s => {
        this.suggestionsToShow = s;
      })
  }
}

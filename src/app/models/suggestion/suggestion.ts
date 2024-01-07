import {SuggestionType} from "./suggestionType";
import {SuggestionStatus} from "./suggestionStatus";

export interface Suggestion {
  id: number,
  author: string,
  type: SuggestionType,
  suggestion: string
  status: SuggestionStatus
  adminComment: string
}

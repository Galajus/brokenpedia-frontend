import {SuggestionType} from "./suggestionType";

export interface Suggestion {
  id: number,
  author: string,
  type: SuggestionType,
  suggestion: string
}

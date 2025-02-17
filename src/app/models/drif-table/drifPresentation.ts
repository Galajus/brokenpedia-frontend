import {DrifCategory} from "@models/drif/drifCategory";

export interface DrifPresentation {
  drifCategory: DrifCategory;
  drifName: string;
  enabled: boolean;
}

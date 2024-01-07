import {RarWithDrifs} from "./rarWithDrifs";

export interface UserRarsWithDrifs {
  name: string,
  critEpicModLevel?: number,
  dedicatedEpicModLevel?: number,
  rarsWithDrifs: RarWithDrifs[];
}

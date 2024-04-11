import {IncrustationTarget} from "@models/items/incrustationTarget";

export interface StatHolder {
  name?: IncrustationTarget,
  stat: number,
  isBy10: boolean
}

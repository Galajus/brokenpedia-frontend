import {Page} from "../page/page";

export interface PageableBuildsDto<T> {
  pageableBuilds: Page<T>;
}

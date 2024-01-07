import {Page} from "../page/page";

export interface PageableMainPagePostDto<T> {
  mainPagePosts: Page<T>;
}

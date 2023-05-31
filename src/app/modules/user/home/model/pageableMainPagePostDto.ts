import {Page} from "../../../../common/model/page";

export interface PageableMainPagePostDto<T> {
  mainPagePosts: Page<T>;
}

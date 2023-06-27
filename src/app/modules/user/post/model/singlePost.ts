import {Category} from "../../../admin/posts/model/category";
import {PublicProfile} from "../../../admin/posts/model/publicProfile";

export interface SinglePost {
  id: number,
  creationDate: Date,
  lastUpdateDate: Date,
  categories: Array<Category>,
  author: PublicProfile,
  slug: string,
  title: string,
  description: string,
  content: string,
  image: string
}

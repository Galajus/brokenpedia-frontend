import {Category} from "./category";
import {PublicProfile} from "../user/publicProfile";

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
  views: number,
  image: string,
  nextPostSlug: string,
  previousPostSlug: string
}

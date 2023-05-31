import {Category} from "./category";
import {PublicProfile} from "./publicProfile";

export interface Post {
  id?: number,
  isPublic: boolean,
  creationDate?: Date,
  lastUpdateDate?: Date,
  categories?: Array<Category>,
  author?: PublicProfile,
  slug?: string,
  title: string,
  description: string,
  content: string,
  image?: string
}

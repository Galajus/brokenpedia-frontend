import { Component, OnInit } from '@angular/core';
import {PostsService} from "./posts.service";
import {Post} from "./model/post";
import {Category} from "./model/category";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  displayedColumns: string[] = ["id", "creationDate", "author", "categories", "title", "isPublic", "actions"];
  dataSource: Post[] = [];

  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.postService.getPosts(0)
      .subscribe(response => this.dataSource = response.mainPagePosts.content);
  }

  getCategoriesList(cats: Array<Category>) {
    return cats.map(cat => cat.categoryName);
  }

  deletePost(id: number) {
    this.postService.deletePost(id)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(p => {
          return p.id !== id;
        });
      })
  }

}

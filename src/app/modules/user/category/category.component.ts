import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Post} from "../../admin/posts/model/post";
import {CategoryService} from "./category.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router) { }

  posts: Post[] | undefined;

  ngOnInit(): void {
    //this.loadPosts();
    this.router.events
      .subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          this.loadPosts();
        }
      })

    const previousUrl = history.state.prevPage ?? null;
    if (!previousUrl) {
      this.loadPosts();
    }
  }

  sendToPost(slug: string | undefined) {
    this.router.navigate(['post/' + slug]);
  }

  sendToCategory(categorySlug: string) {
    this.router.navigate(['category/' + categorySlug])
      .then(() => this.loadPosts());
  }

  sendToPostMouseDown($event: MouseEvent, slug: string | undefined) {
    if ($event.button === 1) {
      $event.preventDefault();
      let url = this.router.serializeUrl(
        this.router.createUrlTree(['post/' + slug])
      );
      window.open(url, '_blank');
    }
  }

  private loadPosts() {
    let categorySlug = this.route.snapshot.params['slug'];
    this.categoryService.getPosts(0, categorySlug)
      .subscribe(response => this.posts = response.mainPagePosts.content);

    document.querySelector('.content')?.scrollIntoView({
      behavior: 'smooth'
    });

  }

}

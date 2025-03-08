import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Post} from "@models/post/post";
import {CategoryService} from "@services/user/category/category.service";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    standalone: false
})
export class CategoryComponent implements OnInit {

  mobileQuery!: MediaQueryList;
  private readonly _mobileQueryListener!: () => void;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("mobile", this._mobileQueryListener);
  }

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

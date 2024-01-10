import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HomeService} from "@services/user/home/home.service";
import {Post} from "@models/post/post";
import {Router} from "@angular/router";
import {MediaMatcher} from "@angular/cdk/layout";
import {DATE_PIPE_DEFAULT_TIMEZONE} from "@angular/common";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mobileQuery!: MediaQueryList;
  private readonly _mobileQueryListener!: () => void;

  constructor(
    private homeService: HomeService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("mobile", this._mobileQueryListener);
  }

  posts: Post[] | undefined;

  ngOnInit(): void {
    this.homeService.getPosts(0)
      .subscribe(response => this.posts = response.mainPagePosts.content);
  }

  sendToPost(slug: string | undefined) {
    this.router.navigate(['post/' + slug]);
  }

  sendToCategory(categorySlug: string) {
    this.router.navigate(['category/' + categorySlug]);
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
}

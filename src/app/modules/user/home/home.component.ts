import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HomeService} from "./home.service";
import {Post} from "../../admin/posts/model/post";
import {Router} from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private homeService: HomeService,
    private router: Router) { }

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

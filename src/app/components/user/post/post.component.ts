import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {PostService} from "@services/user/posts/post.service";
import {SinglePost} from "@models/post/singlePost";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    standalone: false
})
export class PostComponent implements OnInit, OnDestroy {

  singlePost?: SinglePost;
  error: boolean = false;
  postLoadSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit(): void {

    this.loadPost();
    this.postLoadSubscription = this.router.events
      .subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          this.singlePost = undefined;
          this.error = false;
          this.loadPost();
        }
      });
  }

  ngOnDestroy() {
    this.postLoadSubscription.unsubscribe();
  }

  loadPost() {
    let slug = this.route.snapshot.params['slug'];
    this.postService.getSinglePost(slug)
      .subscribe({
        next: post => this.singlePost = post,
        error: err => this.error = true
      });
  }

  changePost(postSlug: string) {
    this.router.navigate(['post/' + postSlug]);
  }

}

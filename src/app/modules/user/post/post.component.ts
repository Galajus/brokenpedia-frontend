import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {PostService} from "./post.service";
import {SinglePost} from "./model/singlePost";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  singlePost?: SinglePost;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit(): void {

    this.loadPost();

    this.router.events
      .subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          this.singlePost = undefined;
          this.error = false;
          this.loadPost();
        }
      })

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

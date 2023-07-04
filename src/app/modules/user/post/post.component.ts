import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
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
    private postService: PostService
  ) { }

  ngOnInit(): void {
    let slug = this.route.snapshot.params['slug'];
    this.postService.getSinglePost(slug)
      .subscribe({
        next: post => this.singlePost = post,
        error: err => this.error = true
      });

  }

}

import {Component, OnInit} from '@angular/core';
import {HomeService} from "./home.service";
import {Post} from "../../admin/posts/model/post";
import {Page} from "../../../common/model/page";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  posts: Post[] | undefined;

  ngOnInit(): void {
    /*this.homeService.getPosts(0)
      .subscribe(response => this.posts = response.mainPagePosts.content);*/
  }
}

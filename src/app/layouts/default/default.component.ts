import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {Router} from "@angular/router";
import {JwtService} from "../../common/service/jwt.service";
import {LoginButtonService} from "../../common/service/login-button.service";
import {PageNode} from "./model/pageNode";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {FlatNode} from "./model/flatNode";
import {DefaultService} from "./default.service";
import {Category} from "../../modules/admin/posts/model/category";
import {AdsenseComponent} from "ng2-adsense";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('bar1') sidebar1!: ElementRef<HTMLElement>;
  @ViewChild('bar2') sidebar2!: ElementRef<HTMLElement>;
  @ViewChild(AdsenseComponent) ads!: AdsenseComponent;

  ro!: ResizeObserver;
  mobileQuery!: MediaQueryList;
  sidebarOpened!: string;
  isLoggedIn = false;
  isAdmin = false;
  categories!: Array<Category>;
  hideAds: boolean = false;
  startAdsWidth: number = 300;
  private readonly _mobileQueryListener!: () => void;

  constructor(
    private router: Router,
    private jwtService: JwtService,
    private loginButtonService: LoginButtonService,
    private defaultService: DefaultService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("mobile", this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.sidenavIsOpened();
    this.isLoggedIn = this.jwtService.isLoggedIn();
    this.isAdmin = this.jwtService.hasAdminAccess();
    this.defaultService.getAllCategories()
      .subscribe(cats => this.categories = cats);
    this.loginButtonService.subject
      .subscribe(loggedIn => this.isLoggedIn = loggedIn);
  }

  ngAfterViewInit(): void {
    this.elementObserver();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("mobile", this._mobileQueryListener);
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  sidenavIsOpened() {
    let isOpened: string | null = localStorage.getItem("sidebar-opened");

    if (isOpened != null) {
      this.sidebarOpened = isOpened;
    } else {
      this.sidebarOpened = "true";
    }
  }

  navChange($event: boolean) {
    localStorage.setItem("sidebar-opened", String($event));
  }


  elementObserver() {
    this.ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        /*console.log(`Element size: ${cr.width.toFixed()}px x ${cr.height.toFixed()}px`);*/
        this.hideAds = (cr.width < 120 || cr.width < (this.startAdsWidth * 0.85));
      }
    });

    this.startAdsWidth = this.sidebar1.nativeElement.clientWidth;
    this.ro.observe(this.sidebar1.nativeElement);
    this.ro.observe(this.sidebar2.nativeElement);
  }
}



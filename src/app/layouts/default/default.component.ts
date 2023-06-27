import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
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

const TREE_DATA: PageNode[] = [
  {
    name: 'Aktualności',
    href: ''
  },
  {
    name: 'Kalkulator Buildów',
    children: [
      {
        name: 'Kalkulator',
        href: '/build-calculator'
      },
      {
        name: 'Lista buildów',
        href: '/build-list'
      },
    ],
  },
  {
    name: 'Kalkulator Psychoexpa',
    href: '/psycho-calculator'
  },
  {
    name: 'Kalkulator Esencji',
    href: '/essence-calculator'
  },
  {
    name: 'BrokenHelper bot',
    href: '/broken-helper'
  }
];

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnDestroy {
  mobileQuery!: MediaQueryList;
  sidebarOpened!: string;
  additionalStyle: string = "";
  isLoggedIn = false;
  isAdmin = false;
  categories!: Array<Category>;
  private readonly _mobileQueryListener!: () => void;

  private _transformer = (node: PageNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  constructor(
    private router: Router,
    private jwtService: JwtService,
    private loginButtonService: LoginButtonService,
    private defaultService: DefaultService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.dataSource.data = TREE_DATA;
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
}

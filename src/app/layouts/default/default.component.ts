import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnDestroy {

  mobileQuery!: MediaQueryList;
  sidebarOpened!: string;
  additionalStyle: string = "";

  private readonly _mobileQueryListener!: () => void;
  constructor(
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("mobile", this._mobileQueryListener);

    router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        if (
          value.url == "/broken-helper" ||
          value.url == "/build-calculator"
        ) {
          this.additionalStyle = "min-width: 900px";
        } else {
          this.additionalStyle = "";
        }
      }
    })
  }

  ngOnInit(): void {
    this.sidenavIsOpened();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("mobile", this._mobileQueryListener);
  }

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

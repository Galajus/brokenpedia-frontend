import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  mobileQuery!: MediaQueryList;
  private readonly _mobileQueryListener!: () => void;
  constructor(
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("mobile", this._mobileQueryListener);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("mobile", this._mobileQueryListener);
  }

}

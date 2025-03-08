import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {NavigationEnd, Router} from "@angular/router";
import {JwtService} from "@services/jwt/jwt.service";
import {LoginButtonService} from "@services/layout/login-button.service";
import {DefaultService} from "./default.service";
import {AdsenseComponent} from "ng2-adsense";
import {environment} from "../../../environments/environment";
import {MatSidenav} from "@angular/material/sidenav";
import {TranslateService} from "@ngx-translate/core";
import {Category} from "@models/post/category";
import {SidebarLinks} from "@models/layout/sidebarLinks";

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss'],
    standalone: false
})
export class DefaultComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('bar1') sidebar1!: ElementRef<HTMLElement>;
  @ViewChild('bar2') sidebar2!: ElementRef<HTMLElement>;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('countryFlag') flag!: ElementRef;
  @ViewChild(AdsenseComponent) ads!: AdsenseComponent;

  addresses: SidebarLinks[] = [
    {addres: "/items-list", linkName: "MAIN_PAGE.ITEMS_LIST", icon: "waves"},
    {addres: "/psycho-calculator", linkName: "MAIN_PAGE.PSYCHO_EXP_CALCULATOR", icon: "gradient"},
    {addres: "/essence-calculator", linkName: "MAIN_PAGE.SHARD_ESSENCES_CALCULATOR", icon: "battery_charging_full"},
    {addres: "/upgrade-simulator", linkName: "MAIN_PAGE.UPGRADE_SIMULATOR", icon: "stars"},
    {addres: "drif-simulator", linkName: "MAIN_PAGE.DRIF_SIMULATOR", icon: "group_work"},
    {addres: "/orbs-table", linkName: "MAIN_PAGE.ORBS_TABLE", icon: "select_all"},
    {addres: "/drifs-table", linkName: "MAIN_PAGE.DRIFS_TABLE", icon: "select_all"},
    {addres: "/dictionary", linkName: "MAIN_PAGE.DICTIONARY", icon: "menu_book"}
  ]

  adLoading: boolean = false;
  lastAdChange: number = 0;
  ro!: ResizeObserver;
  mobileQuery!: MediaQueryList;
  sidebarOpened!: string;
  isLoggedIn = false;
  isAdmin = false;
  categories!: Array<Category>;
  hideAds: boolean = false;
  startAdsWidth: number = 300;
  currentLang: string = "pl";
  private readonly _mobileQueryListener!: () => void;

  constructor(
    private router: Router,
    private jwtService: JwtService,
    private loginButtonService: LoginButtonService,
    private defaultService: DefaultService,
    private translate: TranslateService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("mobile", this._mobileQueryListener);
    translate.setDefaultLang(this.currentLang);
  }

  ngOnInit(): void {
    this.sidenavIsOpened();
    this.isLoggedIn = this.jwtService.isLoggedIn();
    this.isAdmin = this.jwtService.hasAdminAccess();
    this.defaultService.getAllCategories()
      .subscribe(cats => this.categories = cats);
    this.loginButtonService.subject
      .subscribe(loggedIn => this.isLoggedIn = loggedIn);

    const observer = new MutationObserver(() => {
      document.querySelector(".google-revocation-link-placeholder")?.remove();
    });

    observer.observe(document.body, {
      childList: true,
    });

    this.listenAds();
    this.readLanguage();
  }

  readLanguage(){
    let dataString = localStorage.getItem("language");
    if (!dataString) {
      this.translate.use(this.currentLang);
      return;
    }
    this.currentLang = dataString;
    this.translate.use(this.currentLang);
  }

  listenAds() {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.lastAdChange = 0;
        if (this.mobileQuery.matches) {
          this.sidenav.opened = false;
        }
        if (!this.adLoading) {
          this.refreshAds();
        }
      }
    });

    setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }
      this.lastAdChange++;
      if (this.lastAdChange > 44) {
        this.lastAdChange = 0;
        this.refreshAds();
      }
    }, 1000);
  }

  refreshAds() {
    this.adLoading = true;
    setTimeout(() => (this.adLoading = false), 350);
  }

  ngAfterViewInit(): void {
    this.elementObserver();
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

  protected readonly environment = environment;

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    this.flag.nativeElement.src = "assets/i18n/flags/" + lang + ".png"
    localStorage.setItem("language", (lang));
  }

  protected readonly indexedDB = indexedDB;
}



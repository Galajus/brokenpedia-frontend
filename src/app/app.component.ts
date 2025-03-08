import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, Subscription} from "rxjs";
import {
  NgcCookieConsentService,
  NgcInitializationErrorEvent,
  NgcInitializingEvent,
  NgcNoCookieLawEvent,
  NgcStatusChangeEvent
} from "ngx-cookieconsent";
import {Meta, Title} from "@angular/platform-browser";

declare let gtag: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'brokenpedia';

  //keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription!: Subscription;
  private popupCloseSubscription!: Subscription;
  private initializingSubscription!: Subscription;
  private initializedSubscription!: Subscription;
  private initializationErrorSubscription!: Subscription;
  private statusChangeSubscription!: Subscription;
  private revokeChoiceSubscription!: Subscription;
  private noCookieLawSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ccService: NgcCookieConsentService,
    private titleService: Title,
    private metaService: Meta,
  ) {
  }

  ngOnInit(): void {
    this.setupMetaData();
    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.initializingSubscription = this.ccService.initializing$.subscribe(
      (event: NgcInitializingEvent) => {
        // the cookieconsent is initilializing... Not yet safe to call methods like `NgcCookieConsentService.hasAnswered()`
        console.log(`initializing: ${JSON.stringify(event)}`);
      });

    this.initializedSubscription = this.ccService.initialized$.subscribe(
      () => {
        // the cookieconsent has been successfully initialized.
        // It's now safe to use methods on NgcCookieConsentService that require it, like `hasAnswered()` for eg...
        console.log(`initialized: ${JSON.stringify(event)}`);
      });

    this.initializationErrorSubscription = this.ccService.initializationError$.subscribe(
      (event: NgcInitializationErrorEvent) => {
        // the cookieconsent has failed to initialize...
        console.log(`initializationError: ${JSON.stringify(event.error?.message)}`);
      });

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      });
    this.setUpAnalytics();
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializingSubscription.unsubscribe();
    this.initializedSubscription.unsubscribe();
    this.initializationErrorSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }

  setupMetaData() {
    this.titleService.setTitle('Brokenpedia.com - Wikipedia Broken Ranks');
    this.metaService.addTag({
      name: 'description',
      content: `Wszechstronny niezbędnik i kompedium wiedzy każdego gracza gry MMORPG Broken Ranks tworzony przez streamera/youtubera Galajus'a. Dzięki tej wikipedii bardzo szybko odnajdziesz się w świecie gry.`
    });
    this.metaService.addTag({
      name: 'keywords',
      content: 'Broken Ranks, MMORPG, gra online, polska gra, strategiczna gra RPG, fantasy, walka turowa, multiplayer, Taern, Broken Rank Wiki, Galajus'
    });
    this.metaService.addTag({
      name: 'og:description',
      content: `Wszechstronny niezbędnik i kompedium wiedzy każdego gracza gry MMORPG Broken Ranks tworzony przez streamera/youtubera Galajus'a. Dzięki tej wikipedii bardzo szybko odnajdziesz się w świecie gry.`
    });
    this.metaService.addTag({
      name: 'og:title',
      content: `Brokenpedia.com - Wikipedia Broken Ranks`
    });
    this.metaService.addTag({
      name: 'og:type',
      content: `website`
    });
    this.metaService.addTag({
      name: 'og:url',
      content: `https://brokenpedia.com`
    });
    this.metaService.addTag({
      name: 'og:image',
      content: `https://brokenpedia.com/assets/ogimg.jpg`
    });

    /*<meta property="og:title" content="Tytuł Twojej strony" />
    <meta property="og:description" content="Opis Twojej strony" />
    <meta property="og:image" content="URL do obrazu, który ma się pojawić" />
    <meta property="og:url" content="URL Twojej strony" />
    <meta property="og:type" content="website" />

    <meta property="og:url" content="https://brokenpedia.com">
    <meta property="og:image" content="https://brokenpedia.com/assets/ogimg.jpg">
    */
  }

  setUpAnalytics() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let root = this.router.routerState.root;
          while (root!.firstChild) {
            root = root.firstChild;
          }
          let consentModeChoices = localStorage.getItem('consentMode');
          if (consentModeChoices === null) {
            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'analytics_storage': 'granted'
            });
          } else {
            gtag('consent', 'default', JSON.parse(consentModeChoices));
          }
          root.title.subscribe(title => {
            gtag('config', 'G-G9W2JQBFKT',
              {
                page_path: event.urlAfterRedirects,
                page_location: document.location.origin + event.urlAfterRedirects,
                page_title: title
              }
            )
          });
        }
      });
  }

  ngAfterViewInit(): void {
  }
}

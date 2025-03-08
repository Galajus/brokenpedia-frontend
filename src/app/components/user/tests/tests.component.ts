import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-tests',
    templateUrl: './tests.component.html',
    styleUrls: ['./tests.component.scss'],
    standalone: false
})
export class TestsComponent implements OnInit {

  constructor(
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

}

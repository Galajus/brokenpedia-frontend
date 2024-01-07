import {Component, OnInit} from '@angular/core';
import {TestsService} from "./tests.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

  constructor(
    private testsService: TestsService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

}

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BrokenHelperComponent} from './broken-helper.component';

describe('BrokenHelperComponent', () => {
  let component: BrokenHelperComponent;
  let fixture: ComponentFixture<BrokenHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokenHelperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokenHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

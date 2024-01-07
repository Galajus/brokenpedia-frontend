import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DrifSumDialogComponent} from './drif-sum-dialog.component';

describe('DrifSumDialogComponent', () => {
  let component: DrifSumDialogComponent;
  let fixture: ComponentFixture<DrifSumDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrifSumDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrifSumDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

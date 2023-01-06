import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokencalcComponent } from './brokencalc.component';

describe('BrokencalcComponent', () => {
  let component: BrokencalcComponent;
  let fixture: ComponentFixture<BrokencalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokencalcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokencalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

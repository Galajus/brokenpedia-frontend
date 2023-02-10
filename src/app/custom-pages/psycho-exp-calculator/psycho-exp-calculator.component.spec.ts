import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PsychoExpCalculatorComponent} from './psycho-exp-calculator.component';

describe('PsychoExpCalculatorComponent', () => {
  let component: PsychoExpCalculatorComponent;
  let fixture: ComponentFixture<PsychoExpCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsychoExpCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsychoExpCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

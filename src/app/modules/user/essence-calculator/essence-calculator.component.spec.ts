import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EssenceCalculatorComponent} from './essence-calculator.component';

describe('EssenceCalculatorComponent', () => {
  let component: EssenceCalculatorComponent;
  let fixture: ComponentFixture<EssenceCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssenceCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EssenceCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

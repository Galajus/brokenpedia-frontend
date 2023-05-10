import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrifSimulatorComponent } from './drif-simulator.component';

describe('DrifSimulatorComponent', () => {
  let component: DrifSimulatorComponent;
  let fixture: ComponentFixture<DrifSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrifSimulatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrifSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

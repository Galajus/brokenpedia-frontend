import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpgradeSimulatorComponent} from './upgrade-simulator.component';

describe('UpgradeSimulatorComponent', () => {
  let component: UpgradeSimulatorComponent;
  let fixture: ComponentFixture<UpgradeSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradeSimulatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

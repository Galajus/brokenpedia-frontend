import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrbsTableComponent} from './orbs-table.component';

describe('OrbsTableComponent', () => {
  let component: OrbsTableComponent;
  let fixture: ComponentFixture<OrbsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrbsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrbsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

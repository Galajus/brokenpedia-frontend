import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrbsComponent} from './orbs.component';

describe('OrbsComponent', () => {
  let component: OrbsComponent;
  let fixture: ComponentFixture<OrbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

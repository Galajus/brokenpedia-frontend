import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrbComponent } from './update-orb.component';

describe('UpdateOrbComponent', () => {
  let component: UpdateOrbComponent;
  let fixture: ComponentFixture<UpdateOrbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOrbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOrbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

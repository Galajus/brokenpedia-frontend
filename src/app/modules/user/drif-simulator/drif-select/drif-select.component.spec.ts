import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrifSelectComponent } from './drif-select.component';

describe('DrifSelectComponent', () => {
  let component: DrifSelectComponent;
  let fixture: ComponentFixture<DrifSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrifSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrifSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

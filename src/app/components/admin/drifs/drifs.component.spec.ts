import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DrifsComponent} from './drifs.component';

describe('DrifsComponent', () => {
  let component: DrifsComponent;
  let fixture: ComponentFixture<DrifsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrifsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

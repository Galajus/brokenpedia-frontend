import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateRarComponent} from './update-rar.component';

describe('UpdateRarComponent', () => {
  let component: UpdateRarComponent;
  let fixture: ComponentFixture<UpdateRarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

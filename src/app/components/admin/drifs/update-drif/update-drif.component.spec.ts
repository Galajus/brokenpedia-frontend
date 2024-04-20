import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDrifComponent } from './update-drif.component';

describe('UpdateDrifComponent', () => {
  let component: UpdateDrifComponent;
  let fixture: ComponentFixture<UpdateDrifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDrifComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDrifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

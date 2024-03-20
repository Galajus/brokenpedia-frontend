import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetsUpdateComponent } from './sets-update.component';

describe('SetsUpdateComponent', () => {
  let component: SetsUpdateComponent;
  let fixture: ComponentFixture<SetsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetsUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

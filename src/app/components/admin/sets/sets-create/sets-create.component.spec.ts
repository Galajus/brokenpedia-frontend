import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetsCreateComponent } from './sets-create.component';

describe('SetsCreateComponent', () => {
  let component: SetsCreateComponent;
  let fixture: ComponentFixture<SetsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

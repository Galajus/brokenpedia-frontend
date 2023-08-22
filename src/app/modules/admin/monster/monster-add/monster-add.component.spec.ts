import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterAddComponent } from './monster-add.component';

describe('MonsterAddComponent', () => {
  let component: MonsterAddComponent;
  let fixture: ComponentFixture<MonsterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonsterAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonsterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateRarComponent} from './create-rar.component';

describe('CreateRarComponent', () => {
  let component: CreateRarComponent;
  let fixture: ComponentFixture<CreateRarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RarListComponent} from './rar-list.component';

describe('RarListComponent', () => {
  let component: RarListComponent;
  let fixture: ComponentFixture<RarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RarListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

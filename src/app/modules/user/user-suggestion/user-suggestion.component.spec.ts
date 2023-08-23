import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSuggestionComponent } from './user-suggestion.component';

describe('UserSuggestionComponent', () => {
  let component: UserSuggestionComponent;
  let fixture: ComponentFixture<UserSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSuggestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditAdminCommentComponent} from './edit-admin-comment.component';

describe('EditAdminCommentComponent', () => {
  let component: EditAdminCommentComponent;
  let fixture: ComponentFixture<EditAdminCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAdminCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdminCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

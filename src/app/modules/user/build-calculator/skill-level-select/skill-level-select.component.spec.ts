import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillLevelSelectComponent } from './skill-level-select.component';

describe('SkillLevelSelectComponent', () => {
  let component: SkillLevelSelectComponent;
  let fixture: ComponentFixture<SkillLevelSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillLevelSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillLevelSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

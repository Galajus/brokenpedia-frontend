import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportantModsComponent} from './important-mods.component';

describe('ImportantModsComponent', () => {
  let component: ImportantModsComponent;
  let fixture: ComponentFixture<ImportantModsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportantModsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportantModsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

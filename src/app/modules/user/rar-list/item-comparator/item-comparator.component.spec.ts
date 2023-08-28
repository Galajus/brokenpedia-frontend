import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemComparatorComponent} from './item-comparator.component';

describe('ItemComparatorComponent', () => {
  let component: ItemComparatorComponent;
  let fixture: ComponentFixture<ItemComparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemComparatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

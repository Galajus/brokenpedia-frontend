import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DiscordAuthComponent} from './discord-auth.component';

describe('DiscordAuthComponent', () => {
  let component: DiscordAuthComponent;
  let fixture: ComponentFixture<DiscordAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscordAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscordAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

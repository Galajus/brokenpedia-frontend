import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DiscordApiRedirectComponent} from './discord-api-redirect.component';

describe('DiscordApiRedirectComponent', () => {
  let component: DiscordApiRedirectComponent;
  let fixture: ComponentFixture<DiscordApiRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscordApiRedirectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscordApiRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

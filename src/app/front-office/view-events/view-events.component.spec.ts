import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventsComponent } from './view-events.component';

describe('ViewEventsComponent', () => {
  let component: ViewEventsComponent;
  let fixture: ComponentFixture<ViewEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEventsComponent]
    });
    fixture = TestBed.createComponent(ViewEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

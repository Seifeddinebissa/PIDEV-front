import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatsComponent } from './feedback-stats.component';

describe('FeedbackStatsComponent', () => {
  let component: FeedbackStatsComponent;
  let fixture: ComponentFixture<FeedbackStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackStatsComponent]
    });
    fixture = TestBed.createComponent(FeedbackStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

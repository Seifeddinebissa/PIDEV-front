import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackEditComponent } from './feedback-edit.component';

describe('FeedbackEditComponent', () => {
  let component: FeedbackEditComponent;
  let fixture: ComponentFixture<FeedbackEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackEditComponent]
    });
    fixture = TestBed.createComponent(FeedbackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

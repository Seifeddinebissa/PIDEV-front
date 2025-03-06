import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAttemptsComponent } from './quiz-attempts.component';

describe('QuizAttemptsComponent', () => {
  let component: QuizAttemptsComponent;
  let fixture: ComponentFixture<QuizAttemptsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizAttemptsComponent]
    });
    fixture = TestBed.createComponent(QuizAttemptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

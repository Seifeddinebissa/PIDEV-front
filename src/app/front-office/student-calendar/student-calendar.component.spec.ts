import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCalendarComponent } from './student-calendar.component';

describe('StudentCalendarComponent', () => {
  let component: StudentCalendarComponent;
  let fixture: ComponentFixture<StudentCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentCalendarComponent]
    });
    fixture = TestBed.createComponent(StudentCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

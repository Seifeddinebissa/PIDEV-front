import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetInterviewModalComponent } from './set-interview-modal.component';

describe('SetInterviewModalComponent', () => {
  let component: SetInterviewModalComponent;
  let fixture: ComponentFixture<SetInterviewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetInterviewModalComponent]
    });
    fixture = TestBed.createComponent(SetInterviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

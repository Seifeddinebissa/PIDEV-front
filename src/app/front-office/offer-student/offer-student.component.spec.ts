import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferStudentComponent } from './offer-student.component';

describe('OfferStudentComponent', () => {
  let component: OfferStudentComponent;
  let fixture: ComponentFixture<OfferStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfferStudentComponent]
    });
    fixture = TestBed.createComponent(OfferStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

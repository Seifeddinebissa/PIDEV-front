import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsListComponent } from './formations-list.component';

describe('FormationsListComponent', () => {
  let component: FormationsListComponent;
  let fixture: ComponentFixture<FormationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationsListComponent]
    });
    fixture = TestBed.createComponent(FormationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

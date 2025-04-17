import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyEntrepriseComponent } from './apply-entreprise.component';

describe('ApplyEntrepriseComponent', () => {
  let component: ApplyEntrepriseComponent;
  let fixture: ComponentFixture<ApplyEntrepriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyEntrepriseComponent]
    });
    fixture = TestBed.createComponent(ApplyEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

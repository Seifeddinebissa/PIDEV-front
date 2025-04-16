import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaiementComponent } from './add-paiement.component';

describe('AddPaiementComponent', () => {
  let component: AddPaiementComponent;
  let fixture: ComponentFixture<AddPaiementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaiementComponent]
    });
    fixture = TestBed.createComponent(AddPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

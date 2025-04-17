import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOffreModalComponent } from './update-offre-modal.component';

describe('UpdateOffreModalComponent', () => {
  let component: UpdateOffreModalComponent;
  let fixture: ComponentFixture<UpdateOffreModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateOffreModalComponent]
    });
    fixture = TestBed.createComponent(UpdateOffreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

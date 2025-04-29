import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatOffreComponent } from './stat-offre.component';

describe('StatOffreComponent', () => {
  let component: StatOffreComponent;
  let fixture: ComponentFixture<StatOffreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatOffreComponent]
    });
    fixture = TestBed.createComponent(StatOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

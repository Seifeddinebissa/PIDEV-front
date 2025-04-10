import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateursComponent } from './utilisateurs.component';

describe('UtilisateursComponent', () => {
  let component: UtilisateursComponent;
  let fixture: ComponentFixture<UtilisateursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UtilisateursComponent]
    });
    fixture = TestBed.createComponent(UtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

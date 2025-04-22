import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseComponent } from './entreprise.component';

describe('EntrepriseComponent', () => {
  let component: EntrepriseComponent;
  let fixture: ComponentFixture<EntrepriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepriseComponent]
    });
    fixture = TestBed.createComponent(EntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

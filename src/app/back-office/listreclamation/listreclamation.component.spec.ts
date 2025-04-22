import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListreclamationComponent } from './listreclamation.component';

describe('ListreclamationComponent', () => {
  let component: ListreclamationComponent;
  let fixture: ComponentFixture<ListreclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListreclamationComponent]
    });
    fixture = TestBed.createComponent(ListreclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

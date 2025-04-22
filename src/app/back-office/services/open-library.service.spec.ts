import { TestBed } from '@angular/core/testing';

import { OpenLibraryService } from './open-library.service';

describe('OpenLibraryService', () => {
  let service: OpenLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

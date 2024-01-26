import { TestBed } from '@angular/core/testing';

import { CambiarPasswordService } from './cambiar-password.service';

describe('CambiarPasswordService', () => {
  let service: CambiarPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambiarPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

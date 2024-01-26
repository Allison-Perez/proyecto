import { TestBed } from '@angular/core/testing';

import { ServicieKatalinaService } from './servicie.katalina.service';

describe('ServicieKatalinaService', () => {
  let service: ServicieKatalinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicieKatalinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

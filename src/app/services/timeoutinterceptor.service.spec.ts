import { TestBed } from '@angular/core/testing';

import { TimeoutinterceptorService } from './timeoutinterceptor.service';

describe('TimeoutinterceptorService', () => {
  let service: TimeoutinterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeoutinterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

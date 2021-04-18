import { TestBed } from '@angular/core/testing';

import { WalkthroughGuard } from './walkthrough.guard';

describe('WalkthroughGuard', () => {
  let guard: WalkthroughGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WalkthroughGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

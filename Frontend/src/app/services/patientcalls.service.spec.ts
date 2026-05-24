import { TestBed } from '@angular/core/testing';

import { PatientCallsService } from './patientcalls.service';

describe('PatientCallsService', () => {
  let service: PatientCallsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientCallsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RequestStatusService } from './requeststatus.service';

describe('RequeststatusesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestStatusService]
    });
  });

  it('should ...', inject([RequestStatusService], (service: RequestStatusService) => {
    expect(service).toBeTruthy();
  }));
});

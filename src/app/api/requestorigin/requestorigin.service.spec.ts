/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RequestOriginService } from './requestorigin.service';

describe('RequestoriginsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestOriginService]
    });
  });

  it('should ...', inject([RequestOriginService], (service: RequestOriginService) => {
    expect(service).toBeTruthy();
  }));
});

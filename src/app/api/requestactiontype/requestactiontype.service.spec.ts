/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RequestActionTypeService } from './requestactiontype.service';

describe('RequestActionTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionTypeService]
    });
  });

  it('should ...', inject([RequestActionTypeService], (service: RequestActionTypeService) => {
    expect(service).toBeTruthy();
  }));
});

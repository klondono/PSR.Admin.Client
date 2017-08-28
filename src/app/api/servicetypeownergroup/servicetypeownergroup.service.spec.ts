/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceTypeOwnerGroupService } from './servicetypeownergroup.service';

describe('ServicetypeownergroupsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTypeOwnerGroupService]
    });
  });

  it('should ...', inject([ServiceTypeOwnerGroupService], (service: ServiceTypeOwnerGroupService) => {
    expect(service).toBeTruthy();
  }));
});

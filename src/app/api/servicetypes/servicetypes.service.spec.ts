/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceTypeService } from './servicetype.service';

describe('ServicetypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTypeService]
    });
  });

  it('should ...', inject([ServiceTypeService], (service: ServiceTypeService) => {
    expect(service).toBeTruthy();
  }));
});

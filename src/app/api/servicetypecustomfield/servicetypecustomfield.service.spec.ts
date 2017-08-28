/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceTypeCustomFieldService } from './servicetypecustomfield.service';

describe('ServiceTypeCustomFieldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTypeCustomFieldService]
    });
  });

  it('should ...', inject([ServiceTypeCustomFieldService], (service: ServiceTypeCustomFieldService) => {
    expect(service).toBeTruthy();
  }));
});

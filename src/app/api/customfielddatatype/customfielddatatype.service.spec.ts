/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CustomFieldDataTypeService } from './customfielddatatype.service';

describe('CustomFieldDataTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomFieldDataTypeService]
    });
  });

  it('should ...', inject([CustomFieldDataTypeService], (service: CustomFieldDataTypeService) => {
    expect(service).toBeTruthy();
  }));
});

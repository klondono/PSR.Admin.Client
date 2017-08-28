/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CustomFieldTypeService } from './customfieldtype.service';

describe('CustomFieldTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomFieldTypeService]
    });
  });

  it('should ...', inject([CustomFieldTypeService], (service: CustomFieldTypeService) => {
    expect(service).toBeTruthy();
  }));
});

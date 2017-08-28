/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RequestActionTypeCustomFieldService } from './requestactiontypecustomfield.service';

describe('RequestActionTypeCustomFieldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionTypeCustomFieldService]
    });
  });

  it('should ...', inject([RequestActionTypeCustomFieldService], (service: RequestActionTypeCustomFieldService) => {
    expect(service).toBeTruthy();
  }));
});

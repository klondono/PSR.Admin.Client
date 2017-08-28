/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceTypeEditService } from './servicetype-edit.service';;

describe('ServiceTypeEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTypeEditService]
    });
  });

  it('should ...', inject([ServiceTypeEditService], (service: ServiceTypeEditService) => {
    expect(service).toBeTruthy();
  }));
});
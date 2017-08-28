/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActionTypeEditService } from './actiontype-edit.service';

describe('ActionTypeEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionTypeEditService]
    });
  });

  it('should ...', inject([ActionTypeEditService], (service: ActionTypeEditService) => {
    expect(service).toBeTruthy();
  }));
});

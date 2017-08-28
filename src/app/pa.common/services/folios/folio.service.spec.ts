/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FolioService } from './folio.service';

describe('FolioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FolioService]
    });
  });

  it('should ...', inject([FolioService], (service: FolioService) => {
    expect(service).toBeTruthy();
  }));
});

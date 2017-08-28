/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceTypeSearchKeywordService } from './servicetypesearchkeyword.service';

describe('ServicetypesearchkeywordsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTypeSearchKeywordService]
    });
  });

  it('should ...', inject([ServiceTypeSearchKeywordService], (service: ServiceTypeSearchKeywordService) => {
    expect(service).toBeTruthy();
  }));
});

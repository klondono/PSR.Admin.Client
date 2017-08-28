import { TestBed, inject } from '@angular/core/testing';

import { DbObjectService } from './dbobject.service';

describe('DbObjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbObjectService]
    });
  });

  it('should be created', inject([DbObjectService], (service: DbObjectService) => {
    expect(service).toBeTruthy();
  }));
});

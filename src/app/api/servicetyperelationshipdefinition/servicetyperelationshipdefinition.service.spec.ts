/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceTypeRelationshipDefinitionService } from './servicetyperelationshipdefinition.service';

describe('ServiceTypeRelationshipDefinitionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTypeRelationshipDefinitionService]
    });
  });

  it('should ...', inject([ServiceTypeRelationshipDefinitionService], (service: ServiceTypeRelationshipDefinitionService) => {
    expect(service).toBeTruthy();
  }));
});

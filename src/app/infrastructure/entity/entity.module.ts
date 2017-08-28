import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../config/module-import-guard';
import { EntityService } from './entityservice/entity.service';


@NgModule({
  imports: [CommonModule],
  exports: [],
  declarations: [],
  providers: [EntityService]
})
export class EntityModule {
  constructor(@Optional() @SkipSelf() prior: EntityModule) {
    throwIfAlreadyLoaded(prior, 'EntityModule')
  }
}
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PACommonServicesModule } from './services/pa.common.services.module';
import { PACommonPipesModule } from './pipes/pa.common.pipes.module';
import { throwIfAlreadyLoaded } from './config/module-import-guard';


@NgModule({
  imports: [
    CommonModule,
    PACommonServicesModule,
    PACommonPipesModule
  ],
  exports:[PACommonPipesModule]
})
export class PACommonModule {
  constructor(@Optional() @SkipSelf() prior: PACommonModule) {
    throwIfAlreadyLoaded(prior, 'PACommonModule')
  }
}



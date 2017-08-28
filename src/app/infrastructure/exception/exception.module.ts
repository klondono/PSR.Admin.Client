import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../config/module-import-guard';
import { ExceptionService } from './exceptionservice/exception.service';

@NgModule({
  imports: [CommonModule],
  exports: [],
  declarations: [],
  providers: [ExceptionService]
})
export class ExceptionModule {
  constructor(@Optional() @SkipSelf() prior: ExceptionModule) {
    throwIfAlreadyLoaded(prior, 'ExceptionModule')
  }
}
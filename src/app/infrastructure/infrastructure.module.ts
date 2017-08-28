import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ModalModule} from './modal/modal.module';
import {SpinnerModule} from './spinner/spinner.module';
import {ExceptionModule} from './exception/exception.module';
import {EntityModule} from './entity/entity.module';
import {GeneralModule} from './general/general.module';
import {throwIfAlreadyLoaded} from './config/module-import-guard'

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    ExceptionModule,
    SpinnerModule,
    EntityModule,
    GeneralModule
  ],
  exports: [ModalModule, SpinnerModule, ExceptionModule, EntityModule, GeneralModule]
})
export class InfrastructureModule {
  constructor( @Optional() @SkipSelf() parentModule: InfrastructureModule) {
    throwIfAlreadyLoaded(parentModule, 'InfrastructureModule');
  }
 }

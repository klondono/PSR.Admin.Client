import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../config/module-import-guard';
import { GeneralService } from './general.service';

@NgModule({
  imports: [CommonModule],
  providers: [GeneralService]
})
export class GeneralModule {
  constructor(@Optional() @SkipSelf() parentModule: GeneralModule) {
    throwIfAlreadyLoaded(parentModule, 'GeneralModule')
  }
}
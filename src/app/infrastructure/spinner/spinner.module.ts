import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../config/module-import-guard';
import { SpinnerService } from './spinnerservice/spinner.service';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [CommonModule],
  exports: [SpinnerComponent],
  declarations: [SpinnerComponent],
  providers: [SpinnerService]
})
export class SpinnerModule {
  constructor(@Optional() @SkipSelf() parentModule: SpinnerModule) {
    throwIfAlreadyLoaded(parentModule, 'SpinnerModule')
  }
}

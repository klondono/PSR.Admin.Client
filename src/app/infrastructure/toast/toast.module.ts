import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../config/module-import-guard';
import { ToastComponent } from './toast/toast.component';
import { ToastService } from './toastservice/toast.service';

@NgModule({
  imports: [CommonModule],
  exports: [ToastComponent],
  declarations: [ToastComponent],
  providers: [ToastService]
})
export class ToastModule {
  constructor(@Optional() @SkipSelf() parentModule: ToastModule) {
    throwIfAlreadyLoaded(parentModule, 'ToastModule')
  }
}

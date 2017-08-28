import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../config/module-import-guard';
import { ModalComponent }   from './modal/modal.component';
import { ModalService } from './modalservice/modal.service';

@NgModule({
  imports: [CommonModule],
  exports: [ModalComponent],
  declarations: [ModalComponent],
  providers: [ModalService],
})
export class ModalModule {
  constructor( @Optional() @SkipSelf() parentModule: ModalModule) {
    throwIfAlreadyLoaded(parentModule, 'ModalModule');
    console.log("created modal service");
  }
}

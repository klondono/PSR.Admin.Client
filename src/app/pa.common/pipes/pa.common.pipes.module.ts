import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormatFolioPipe } from './folios/format-folio.pipe';
import { FormGroupPipe } from './formControls/form-group.pipe'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormatFolioPipe, FormGroupPipe],
  exports: [FormatFolioPipe, FormGroupPipe]
})
export class PACommonPipesModule { }

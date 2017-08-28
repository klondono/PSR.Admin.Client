import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ActionTypeRoutingModule, routedActionTypeComponents } from './actiontype-router/actiontype-routing.module';
import { ActionTypeEditService } from './shared/services/actiontype-edit.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ActionTypeRoutingModule],
  declarations: [routedActionTypeComponents],
  providers:[ActionTypeEditService]
})
export class ActionTypesModule {
  constructor() {}
}

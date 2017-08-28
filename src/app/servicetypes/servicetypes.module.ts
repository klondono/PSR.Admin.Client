import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ServiceTypeRoutingModule, routedServiceTypeComponents } from './servicetype-router/servicetype-routing.module';
import { ServiceTypeEditService } from './shared/services/servicetype-edit.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ServiceTypeRoutingModule],
  declarations: [routedServiceTypeComponents],
  providers:[ServiceTypeEditService]
})
export class ServiceTypesModule {
  constructor() {}
}

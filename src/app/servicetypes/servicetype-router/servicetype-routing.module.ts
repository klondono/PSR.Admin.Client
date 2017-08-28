import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceTypeListComponent, ServiceTypeComponent, ServiceTypeEditComponent, ServiceTypeActionTypeEditComponent,
  ServiceTypeCustomFieldEditComponent, ServiceTypeKeywordEditComponent } from '../';

const routes: Routes = [
  { path: '', component: ServiceTypeListComponent},
  {
    path: ':id',
    component: ServiceTypeComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'Edit' },
      {path: 'Edit', component: ServiceTypeEditComponent },
      {path: 'ActionTypes', component: ServiceTypeActionTypeEditComponent},
      {path: 'Keywords', component: ServiceTypeKeywordEditComponent},
      {path: 'CustomFields', component: ServiceTypeCustomFieldEditComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceTypeRoutingModule { }

export const routedServiceTypeComponents = [ServiceTypeListComponent, ServiceTypeComponent, ServiceTypeEditComponent,
ServiceTypeActionTypeEditComponent, ServiceTypeCustomFieldEditComponent, ServiceTypeKeywordEditComponent];

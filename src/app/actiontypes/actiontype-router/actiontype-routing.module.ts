import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionTypeListComponent, ActionTypeComponent, ActionTypeEditComponent,ActionTypeCustomFieldEditComponent } from '../';

const routes: Routes = [
  { path: '', component: ActionTypeListComponent},
  {
    path: ':id',
    component: ActionTypeComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'Edit' },
      {path: 'Edit', component: ActionTypeEditComponent },
      {path: 'CustomFields', component: ActionTypeCustomFieldEditComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionTypeRoutingModule { }

export const routedActionTypeComponents = [ActionTypeListComponent, ActionTypeComponent, ActionTypeEditComponent,ActionTypeCustomFieldEditComponent];

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WorkflowComponent, WorkflowTreeViewComponent, WorkflowEditComponent } from '../';

const routes: Routes = [
  { path: '', component: WorkflowComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowRoutingModule { }

export const routedWorkflowComponents = [WorkflowComponent, WorkflowTreeViewComponent, WorkflowEditComponent];

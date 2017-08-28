import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { routedWorkflowComponents, WorkflowRoutingModule } from './workflow-router/workflow-routing.module';
import { WorkflowService } from './shared/services/workflow.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, WorkflowRoutingModule],
  declarations: [routedWorkflowComponents],
  providers:[WorkflowService]
})
export class WorkflowsModule {
  constructor() {}
}

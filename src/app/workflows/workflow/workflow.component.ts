import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { WorkflowNode, IServiceTypeRelationshipDefinition } from '../../models';
import { WorkflowTreeViewComponent } from './workflow-tree-view.component'
import { ServiceTypeRelationshipDefinitionService } from '../../api';
import { WorkflowService} from '../shared/services/workflow.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {

  workflowNodes: Array<WorkflowNode>;
  serviceTypeRelationships: Array<IServiceTypeRelationshipDefinition>;
  private deletionSubscription: Subscription

  constructor(
    private workflowService: WorkflowService,
    private serviceTypeRelationshipDefinitionService: ServiceTypeRelationshipDefinitionService) { }

  ngOnInit() {
    this.getServiceTypeRelationshipDefinitions();
    this.subscribeToTreeviewDeletionEvent();
  }

  ngOnDestroy(){
    this.unsubscribeFromObservables()
  }

  onWorkflowChanged(event: Event) {
    //notification (via emit) from workflow edit or tree-view components that record was saved or deleted so that this component refreshes treeview
    this.getServiceTypeRelationshipDefinitions();
  }

  subscribeToTreeviewDeletionEvent(){
    this.deletionSubscription = this.workflowService.onWorkflowRelationshipDeletion().subscribe(value =>
      {
          if(value) {
          this.getServiceTypeRelationshipDefinitions();
          }
      },
      (err) => {console.error(err)},
      ()=> {console.log('completed onWorkflowRelationshipDeletion subscription.')}
    )
  }

  unsubscribeFromObservables(){
      this.deletionSubscription.unsubscribe();
  }

  getServiceTypeRelationshipDefinitions() {
    this.serviceTypeRelationships = [];
    let odataParams = `/?$expand=ServiceType1&$select=ServiceTypeRelationshipDefinitionID,ServiceTypeParentID,ServiceTypeChildStartTriggerID&$orderby=ServiceType1/ServiceTypeName`;
    this.serviceTypeRelationshipDefinitionService.getServiceTypeRelationshipDefinitions(odataParams).subscribe(
      (data: IServiceTypeRelationshipDefinition[]) => {
        this.onRelationshipDefinitionRetrieval(data);
        //create root service type and set to first index in @output serviceTypeRelationships array
        //to be consumed by workflow edit component
        let root: IServiceTypeRelationshipDefinition = {
          ServiceType1: {ServiceTypeID: 1, ServiceTypeName: 'Workflow Root'}};
        this.serviceTypeRelationships = data;
        this.serviceTypeRelationships.splice(0,0,root);
      },
      (err) => { console.error(err) },
      () => { console.log('completed getServiceTypeRelationshipDefinitions subscription.') })
  }

  onRelationshipDefinitionRetrieval(associatedServiceTypes: IServiceTypeRelationshipDefinition[]) {
    this.workflowNodes = [];
    let x = associatedServiceTypes[0];

    //initialize workflow tree with hard coded root
    let workflowNode = new WorkflowNode(0,1,0,'Workflow Root','','','','', [], []);

    this.workflowNodes.push(workflowNode);
    let newAssociatedServiceTypes = associatedServiceTypes;
    this.generateTreeview(newAssociatedServiceTypes, workflowNode, 1);
  }

  generateTreeview(associatedServiceTypes: IServiceTypeRelationshipDefinition[], workflow: WorkflowNode, id: number) {
    associatedServiceTypes.forEach(x => {
      if (x.ServiceTypeParentID === id) {

        let childWorkflow = new WorkflowNode(x.ServiceTypeRelationshipDefinitionID,
        x.ServiceType1.ServiceTypeID,
        x.ServiceTypeParentID,
        x.ServiceType1.ServiceTypeName,
        this.getStartTriggerName(x.ServiceTypeChildStartTriggerID),
        this.getConcurrentCreationOfChildrenRule(x.ServiceType1.ServiceTypeConcurrentCreationOfChildrenFlag),
        this.getClosesWithChildrenRule(x.ServiceType1.ServiceTypeParentClosesWhenChildrenClosedFlag),
        this.getShowAsStandaloneServiceRule(x.ServiceType1.ServiceTypeShowAsStandaloneServiceFlag),
        [], []);

        workflow.WorkflowNodes.push(childWorkflow);
        this.generateTreeview(associatedServiceTypes, childWorkflow, x.ServiceType1.ServiceTypeID);
      }
    })
  }

  getStartTriggerName(id: number): string{

    let startTriggerName = 'Starts with parent';
    if(id === 2){
        startTriggerName = 'Starts after parent';
    }
    return startTriggerName;
  }

  getConcurrentCreationOfChildrenRule(flag: boolean): string{

    let concurrencyRule = 'Child requests not generated concurrently';
    if(flag){
        concurrencyRule = 'Child requests generated concurrently';
    }
    return concurrencyRule;
  }

  getClosesWithChildrenRule(flag: boolean): string{
    let closeRule = 'Closes independent of child requests';
    if(flag){
        closeRule = 'Closure depends on child requests';
    }
    return closeRule;
  }

  getShowAsStandaloneServiceRule(flag: boolean): string{
    let standaloneRule = 'Not a standalone Service Type.';
    if(flag){
        standaloneRule = 'Standalone Service Type.';
    }
    return standaloneRule;
  }
}


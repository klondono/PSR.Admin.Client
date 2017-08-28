import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { WorkflowNode, ServiceTypeRelationshipDefinitionDeletionModel } from '../../models';
import { WorkflowService } from '../shared/services/workflow.service';
import { ServiceTypeRelationshipDefinitionService } from '../../api';
import { ModalService } from '../../infrastructure';

@Component({
  selector: 'app-workflow-tree-view',
  templateUrl: './workflow-tree-view.component.html',
  styleUrls: ['./workflow-tree-view.component.css']
})
export class WorkflowTreeViewComponent implements OnInit {

  @Input() workflowNodes: Array<WorkflowNode>;

  constructor(
    private workflowService: WorkflowService,
    private toastManager: ToastsManager,
    private modalService: ModalService,
    private serviceTypeRelationshipDefinitionService: ServiceTypeRelationshipDefinitionService) { }

  ngOnInit() {
  }

  deleteServiceTypeRelationship(relationshipID: number, deletionCode: number) {

    let deletionModel = new ServiceTypeRelationshipDefinitionDeletionModel();
    deletionModel.ServiceTypeRelationshipDefinitionID = relationshipID;
    deletionModel.DeletionTypeCode = deletionCode;

      let strMessage = ``;
      switch(deletionModel.DeletionTypeCode) {
      case 0:
      strMessage = `Are you sure you wish to delete this workflow relationship and link all decendants to Root?`;
      break;
      case 1:
      strMessage = `Are you sure you wish to delete this workflow relationship and ALL decendants?`;
      break;
      default:
      strMessage = `Are you sure you wish to delete this workflow relationship and link all decendants to the Parent?`;
    }
    this.showConfirmDeleteModal(strMessage,
    `Delete Workflow Relationship`, deletionModel);
  }

  showConfirmDeleteModal(message: string, title: string, deletionModel: ServiceTypeRelationshipDefinitionDeletionModel) {
    this.modalService.activate(message, title, 'Yes', 'Cancel').then(responseOK => {
      if (responseOK) {
          this.deleteConfirmed(deletionModel);
      }
    });
  }

  deleteConfirmed(deletionModel: ServiceTypeRelationshipDefinitionDeletionModel){

    this.serviceTypeRelationshipDefinitionService.deleteServiceTypeRelationshipDefinition(deletionModel).subscribe(
      (value: any) => {
        this.onDeleteComplete(value, `Workflow relationship was deleted succesfully.`);
      },
      (err) => { console.error(err) },
      () => { console.log('completed getServiceTypeRelationshipDefinitions subscription.') })
  }

  onDeleteComplete(value: any, saveMsg: string) {
    if (value !== false) {
      //notify (via shared service) parent workflow component that record was deleted so that workflow component refreshes treeview
      this.workflowService.triggerWorkflowRelationshipTreeviewRefresh();
      this.toastManager.success(saveMsg, 'Success!');
    }
  }
}

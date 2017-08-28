import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { IServiceTypeRelationshipDefinition, IDropdownListType, IServiceType } from '../../models';
import { GeneralService, EntityService } from '../../infrastructure';
import { ServiceTypeService, ServiceTypeRelationshipDefinitionService } from '../../api';
import { WorkflowService, EditRelationshipInfo} from '../shared/services/workflow.service';

@Component({
  selector: 'app-workflow-edit',
  templateUrl: './workflow-edit.component.html',
  styleUrls: ['./workflow-edit.component.css']
})
export class WorkflowEditComponent implements OnInit {
    @Input() serviceTypeRelationships: Array<IServiceTypeRelationshipDefinition>;
    @Output() workflowSaved:EventEmitter<string> = new EventEmitter();

    private frmWorkflowEdit: FormGroup;
    private fieldSetLegend: string;
    private alertInfoMsg: string;
    private selectedWorkflowSubscription: Subscription;
    private selectedParentIDSubscription: Subscription;
    private relationshipDef: IServiceTypeRelationshipDefinition;
    private serviceTypes: IServiceType[];
    private serviceTypeParents: IServiceType[];
    private requiredOptions: IDropdownListType[] = [{ BlnValue: true, Label: "Required" },
    { BlnValue: false, Label: "Optional" }];
    private startTriggerOptions: IDropdownListType[] = [{ IntValue: 1, Label: "In Parallel with Selected Parent" },
    { IntValue: 2, Label: "After Selected Parent" }];
    private booleanOptions: IDropdownListType[] = [{ BlnValue: true, Label: "True" },
    { BlnValue: false, Label: "False" }];

    constructor(private fb: FormBuilder,
    private toastManager: ToastsManager,
    private entityService: EntityService,
    private generalService: GeneralService,
    private serviceTypeService: ServiceTypeService,
    private workflowService: WorkflowService,
    private serviceTypeRelationshipDefinitionService: ServiceTypeRelationshipDefinitionService,
    private location: Location) { }

  ngOnInit() {
    this.initializeForm();
    this.generalService.subscribeToTooltipMessages('ServiceTypeRelationshipDefinition');
  }

  ngOnDestroy(){
    this.unsubscribeFromObservables();
    this.generalService.unsubscribeFromTooltipMessages();
  }

  initializeForm() {
    this.setCaptions();
    this.getServiceTypeList();
    this.generateForm();
    this.getRelationshipDefinition(0);
  }

  generateForm() {

      this.frmWorkflowEdit = this.fb.group({
          ServiceTypeRelationshipDefinitionID: 0,
          ServiceTypeParentID:['', [<any>Validators.required]],
          ServiceTypeChildID:['', [<any>Validators.required]],
          ServiceTypeChildStartTriggerID:[2,[<any>Validators.required]],
          ServiceTypeChildStartDelay:[0, [<any>Validators.required, <any>Validators.pattern('^[0-9][0-9]*')]],
          ServiceTypeChildDuration:[0, [<any>Validators.required, <any>Validators.pattern('^[1-9][0-9]*')]],
          ServiceTypeChildRequiredFlag:[true, [<any>Validators.required]],
          ServiceTypeChildCheckedByDefaultFlag:[true, [<any>Validators.required]]
    });

      this.subscribeToObservables();
  }

  setFormValues(relationshipDef: IServiceTypeRelationshipDefinition){

    this.frmWorkflowEdit.patchValue({
          ServiceTypeRelationshipDefinitionID: relationshipDef.ServiceTypeRelationshipDefinitionID,
          ServiceTypeParentID: (relationshipDef.ServiceTypeParentID || ''),
          ServiceTypeChildID: (relationshipDef.ServiceTypeChildID || ''),
          ServiceTypeChildStartTriggerID: relationshipDef.ServiceTypeChildStartTriggerID,
          ServiceTypeChildStartDelay: relationshipDef.ServiceTypeChildStartDelay,
          ServiceTypeChildDuration: relationshipDef.ServiceTypeChildDuration,
          ServiceTypeChildRequiredFlag: relationshipDef.ServiceTypeChildRequiredFlag,
          ServiceTypeChildCheckedByDefaultFlag: relationshipDef.ServiceTypeChildCheckedByDefaultFlag
    })
  }

  subscribeToObservables(){
      this.subscribeToSelectedWorkflowNodeChanges();
      this.subscribeToParentDropdownListValueChanges();
  }

  subscribeToParentDropdownListValueChanges(){
      this.selectedParentIDSubscription = this.frmWorkflowEdit.get('ServiceTypeParentID').valueChanges
      .subscribe((value:number) => {
        this.onServiceTypeParentIDValueChanges(value);
      },
      (err)=> console.log(err),
      ()=>console.log('completed subscribeToParentDropdownListValueChanges subscription'))
  }

  onServiceTypeParentIDValueChanges(value: number){
    let ctlTriggerID = this.frmWorkflowEdit.get('ServiceTypeChildStartTriggerID');
    let ctlDelay = this.frmWorkflowEdit.get('ServiceTypeChildStartDelay');
    let ctlDuration = this.frmWorkflowEdit.get('ServiceTypeChildDuration');
    let ctlRequired = this.frmWorkflowEdit.get('ServiceTypeChildRequiredFlag');
    let ctlChild = this.frmWorkflowEdit.get('ServiceTypeChildCheckedByDefaultFlag');

    if(value){
        if(value == 1){
            this.frmWorkflowEdit.patchValue({
              ServiceTypeChildStartTriggerID: 1,
              ServiceTypeChildDuration: 0,
              ServiceTypeChildStartDelay: 0,
              ServiceTypeChildCheckedByDefaultFlag: true,
              ServiceTypeChildRequiredFlag: true
            })
            ctlTriggerID.disable();
            ctlDelay.disable();
            ctlDuration.disable();
            ctlRequired.disable();
            ctlChild.disable();
        }
        else
        {
            ctlTriggerID.enable();
            ctlDelay.enable();
            ctlDuration.enable();
            ctlRequired.enable();
            ctlChild.enable();
        }
    }
  }

  subscribeToSelectedWorkflowNodeChanges(){
      this.selectedWorkflowSubscription = this.workflowService.getServiceTypeRelationshipDefinitionID()
      .subscribe((object: EditRelationshipInfo) => {
          //if user selected Edit in Workflow Treeview then go directly to getRelationshipDefinition function otherwise
          //if user selected Add Child then go to AddNew function with a DefaultParnetID greater than zero
          object.DefaultParentID == 0 ?
          this.getRelationshipDefinition(object.RelationshipID) :
          this.addNew(object.DefaultParentID);
      },
      err => console.log(err),
      () => console.log('completed subscription to selectedWorkflowSubscription'));
  }

  getRelationshipDefinition(id: number, parentID: number = 0) {
    //remove metadata from response
    const odataParams: string = `/?$format=application/json;odata.metadata=none`;
    this.serviceTypeRelationshipDefinitionService.getServiceTypeRelationshipDefinition(id, odataParams)
      .subscribe((data: IServiceTypeRelationshipDefinition) => {
            this.relationshipDef = data;
            this.frmWorkflowEdit.disable();
            this.relationshipDef.ServiceTypeParentID = this.SetParentIDDefault(parentID, data.ServiceTypeParentID, data.ServiceTypeRelationshipDefinitionID);
            this.setFormValues(this.relationshipDef);
      },
      err => console.log(err),
      () => console.log('completed subscription to getServiceTypeRelationshipDefinition'));
  }

  SetParentIDDefault(id: number, serviceTypeParentID: number, relationshipID: number) : number {
    let defaultID = serviceTypeParentID
    let ctlParentID = this.frmWorkflowEdit.get('ServiceTypeParentID');
    let ctlChildID = this.frmWorkflowEdit.get('ServiceTypeChildID');

    //Add Child
    if(id > 0){
      this.frmWorkflowEdit.enable();
      ctlParentID.disable();
      ctlChildID.enable();
      defaultID = id;
      this.fieldSetLegend = 'Workflow Relationship - Add Child';
      this.alertInfoMsg = `Service types that are designated to be the starting point for any workflow,
      must have its 'Appears In New Request Form Select List' flag set to true.  Additionally, you may
      designate whether the service type's children are generated concurrently and whether it closes based on the closure of its children.
      Please refer to these options under the general tab for Service Types.`;
    }
    //Edit
    else if (relationshipID > 0)
    {
      this.frmWorkflowEdit.enable();
      ctlChildID.disable();
      ctlParentID.enable();
      this.fieldSetLegend = 'Workflow Relationship - Edit';
      this.alertInfoMsg = `Updating the Parent for a particular Service Type will cause all of its children, if any, to move along with it.`;
    }
    return defaultID;
  }

  getServiceTypeList() {
    this.serviceTypes = [];
    const odataParams: string = `?$filter=(AdmIsActive eq 'Y')&$orderby=ServiceTypeName`;
    this.serviceTypeService.getServiceTypes(odataParams)
      .subscribe(data => {
        this.serviceTypes = data;
      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed getServiceTypesAndCacheResult subscription');
      });
  }

  addNew(defaultParentID?: number){
      this.frmWorkflowEdit.reset();
      this.getRelationshipDefinition(0, defaultParentID);
  }

  unsubscribeFromObservables() {
    this.selectedWorkflowSubscription.unsubscribe();
    this.selectedParentIDSubscription.unsubscribe();
  }

  saveRelationship(){

    if (this.frmWorkflowEdit.dirty && this.frmWorkflowEdit.valid) {

    this.generalService.toggleSaveButtonMode();

    let serviceTypeRelationship : IServiceTypeRelationshipDefinition = this.entityService.merge({}, this.relationshipDef, this.frmWorkflowEdit.getRawValue());
    serviceTypeRelationship.ServiceTypeRelationshipDefinitionID === 0 ? this.createRelationship(serviceTypeRelationship) : this.updateRelationship(serviceTypeRelationship);
    }
  }

  createRelationship(newRelationshipDefinition: IServiceTypeRelationshipDefinition){
        let odataParams = `/?$format=application/json;odata.metadata=none`
        this.serviceTypeRelationshipDefinitionService.addServiceTypeRelationshipDefinition(newRelationshipDefinition, odataParams)
        .subscribe((value) => this.onSaveComplete(value, `Successfully created Service Type relationship.`),
        (err) => this.generalService.toggleSaveButtonMode(),
        () => console.log(`completed addServiceTypeRelationshipDefinition subscription.`)
      )
  }

  updateRelationship(updatedRelationshipDefinition: IServiceTypeRelationshipDefinition){

      this.serviceTypeRelationshipDefinitionService.updateServiceTypeRelationshipDefinition(updatedRelationshipDefinition)
      .subscribe((value) => this.onSaveComplete(value, `Successfully updated relationship service type relationship.`),
      (err) => this.generalService.toggleSaveButtonMode(),
      () => console.log(`completed updateServiceTypeRelationshipDefinition subscription.`)
      )
  }

  onSaveComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      //notify (via emit) parent workflow component that record was saved so that workflow component refreshes treeview
      this.workflowSaved.emit('saved');
      this.toastManager.success(saveMsg, 'Success!');
      this.frmWorkflowEdit.reset();
      this.setFormValues(value);
      this.frmWorkflowEdit.disable();
      this.setCaptions();
    }

    this.generalService.toggleSaveButtonMode();
  }

  setCaptions(){
    this.fieldSetLegend = 'Workflow Relationship'
    this.alertInfoMsg = 'To modify, add, or delete a workflow relationship, please select a menu option from the corresponding tree-view node.';
  }

  goBack(): void {
    this.location.back();
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

import { ServiceTypeRequestActionTypeLinkService, RequestActionTypeService } from '../../api';
import { IServiceTypeRequestActionTypeLink, IDisplayCode, IRequestActionType, IDropdownListType, ServiceTypeActionTypeLinkContainerModel } from '../../models';
import { ServiceTypeEditService } from '../shared/services/servicetype-edit.service';
import { ExceptionService, GeneralService } from '../../infrastructure';

@Component({
  selector: 'app-servicetype-actiontype-edit',
  templateUrl: './servicetype-actiontype-edit.component.html',
  styleUrls: ['./servicetype-actiontype-edit.component.css']
})
export class ServiceTypeActionTypeEditComponent implements OnInit, OnDestroy {

  private paramID: number = null;
  private frmServiceTypeActionTypeEdit: FormGroup;
  private precedenceConstraintValueChangeSubscriptions: Subscription[] = [];
  private deletedActionTypeLinkIDs: number[] = [];
  private actionTypeLinkList: IServiceTypeRequestActionTypeLink[];
  private requestActionTypes: IRequestActionType[];
  private displayCodeTypes: IDisplayCode[] = [{ "DisplayCode": 1, "DisplayCodeName": "Update PSR Section" }, { "DisplayCode": 2, "DisplayCodeName": "Available Actions Panel" }];
  private precedenceConstraintLogicalOperatorTypes: IDropdownListType[] = [{ "BlnValue": true, "Label": "Any of the preceding actions identified must occur." }, { "BlnValue": false, "Label": "All of the preceding actions identified must occur." }];
  private odataParams: string = ``;
  private get actionTypeLinkArray(): FormArray {
    return <FormArray>this.frmServiceTypeActionTypeEdit.get('serviceTypeRequestActionTypeLinks');
  }

  constructor(private fb: FormBuilder,
    private location: Location,
    private toastManager: ToastsManager,
    private exceptionService: ExceptionService,
    private serviceTypeEditService: ServiceTypeEditService,
    private generalService: GeneralService,
    private requestActionTypeService: RequestActionTypeService,
    private serviceTypeRequestActionTypeLinkService: ServiceTypeRequestActionTypeLinkService) { }

  ngOnInit() {
    this.getRequestActionTypeList();
    this.initializeForm();
    this.generalService.subscribeToTooltipMessages('ServiceTypeRequestActionTypeLink');
  }

  ngOnDestroy(){
    this.unsubscribeFromObservables();
    this.generalService.unsubscribeFromTooltipMessages();
  }

  initializeForm() {
    this.generateForm();
    this.paramID = this.serviceTypeEditService.getServiceTypeIDParam();
    this.getServiceTypeRequestActionTypeLinks(this.paramID);
  }

  generateForm() {
    this.frmServiceTypeActionTypeEdit = this.fb.group({
      serviceTypeRequestActionTypeLinks: this.fb.array([])
      });
  }

  getRequestActionTypeList() {
    this.requestActionTypes = [];
    const odataParams: string = `?$select=RequestActionTypeName,RequestActionTypeID&$filter=(SystemReservedFlag eq false) and (AdmIsActive eq 'Y')&$orderby=RequestActionTypeName`;
    this.requestActionTypeService.getRequestActionTypesAndCacheResult(odataParams)
      .subscribe(data => {
        this.requestActionTypes = data;
      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed getRequestActionTypesAndCacheResult subscription');
      });
  }

  getServiceTypeRequestActionTypeLinks(serviceTypeID: number) {

    this.odataParams = `/?$filter=(ServiceTypeID eq ${serviceTypeID})&$orderby=ListSequence&$format=application/json;odata.metadata=none`
    this.serviceTypeRequestActionTypeLinkService.getServiceTypeRequestActionTypeLinks(this.odataParams).subscribe(
      (data: IServiceTypeRequestActionTypeLink[]) => {
        this.onServiceTypeRequestActionTypeLinksRetrieval(data);
      },
      (err) => { console.error(err) },
      () => { console.log('completed getServiceTypeRequestActionTypeLinks subscription.') })
  }

  onServiceTypeRequestActionTypeLinksRetrieval(data: IServiceTypeRequestActionTypeLink[]): void {

      this.actionTypeLinkList = data;

      this.actionTypeLinkList.forEach(eachActionTypeLink => this.actionTypeLinkArray.push(this.initActionTypeLink(
      eachActionTypeLink.ServiceTypeRequestActionTypeLinkID,
      eachActionTypeLink.ServiceTypeID,
      eachActionTypeLink.RequestActionTypeID,
      eachActionTypeLink.AddActionActiveDirectoryGroupName,
      eachActionTypeLink.UpdateActionActiveDirectoryGroupName,
      eachActionTypeLink.DeleteActionActiveDirectoryGroupName,
      eachActionTypeLink.MaximumAllowedOcurrence,
      eachActionTypeLink.ListSequence,
      eachActionTypeLink.RequestWorkspaceDisplayCode,
      eachActionTypeLink.PrecedenceConstraintRequestActionTypeIDValue,
      eachActionTypeLink.PrecedenceConstraintLogicalOperatorIsORFlag
      )));

    this.subscribeToFormChanges();

    // const newFormGroups = this.actionTypeLinkList.map(eachActionTypeLink => this.initActionTypeLink(
    //   eachActionTypeLink.ServiceTypeRequestActionTypeLinkID,
    //   eachActionTypeLink.ServiceTypeID,
    //   eachActionTypeLink.RequestActionTypeID,
    //   eachActionTypeLink.AddActionActiveDirectoryGroupName,
    //   eachActionTypeLink.UpdateActionActiveDirectoryGroupName,
    //   eachActionTypeLink.DeleteActionActiveDirectoryGroupName,
    //   eachActionTypeLink.MaximumAllowedOcurrence,
    //   eachActionTypeLink.ListSequence,
    //   eachActionTypeLink.RequestWorkspaceDisplayCode,
    //   eachActionTypeLink.PrecedenceConstraintRequestActionTypeIDValue,
    //   eachActionTypeLink.PrecedenceConstraintLogicalOperatorIsORFlag
    //   ));
    // const newFormGroupsArray = this.fb.array(newFormGroups);
    // this.frmServiceTypeActionTypeEdit.setControl('serviceTypeRequestActionTypeLinks', newFormGroupsArray);


  }

  initActionTypeLink(
    serviceTypeRequestActionTypeLinkID?: number,
    serviceTypeID?: number,
    requestActionTypeID?: number,
    addActionActiveDirectoryGroupName?: string,
    updateActionActiveDirectoryGroupName?: string,
    deleteActionActiveDirectoryGroupName?: string,
    maximumAllowedOcurrence?: number,
    listSequence?: number,
    requestWorkspaceDisplayCode?: number,
    precedenceConstraintRequestActionTypeIDValue?: string,
    precedenceConstraintLogicalOperatorIsORFlag?: boolean
  ) {
    return this.fb.group({
      ServiceTypeRequestActionTypeLinkID: [(serviceTypeRequestActionTypeLinkID || 0)],
      ServiceTypeID: [serviceTypeID || this.paramID],
      RequestActionTypeID: [(requestActionTypeID || ''), [<any>Validators.required]],
      AddActionActiveDirectoryGroupName: [(addActionActiveDirectoryGroupName || ''), [<any>Validators.required]],
      UpdateActionActiveDirectoryGroupName: [(updateActionActiveDirectoryGroupName || ''), [<any>Validators.required]],
      DeleteActionActiveDirectoryGroupName: [(deleteActionActiveDirectoryGroupName || ''), [<any>Validators.required]],
      MaximumAllowedOcurrence:  [(maximumAllowedOcurrence || null), [<any>Validators.pattern('^[1-9][0-9]*')]],
      ListSequence: [(listSequence || null), [<any>Validators.required, <any>Validators.pattern('^[1-9][0-9]*')]],
      RequestWorkspaceDisplayCode: [(requestWorkspaceDisplayCode || 1), [<any>Validators.required]],
      PrecedenceConstraintRequestActionTypeIDValue: [(precedenceConstraintRequestActionTypeIDValue || null), <any>Validators.pattern('^[0-9]+(,[0-9]+)*$')],
      PrecedenceConstraintLogicalOperatorIsORFlag: [{value: (typeof precedenceConstraintLogicalOperatorIsORFlag === 'boolean' ? precedenceConstraintLogicalOperatorIsORFlag : ''),
        disabled: precedenceConstraintRequestActionTypeIDValue == '' || precedenceConstraintRequestActionTypeIDValue == null},[<any>Validators.required]]
    });
  }

  addActionTypeLink(): void {
    const newFormGroup = this.initActionTypeLink();
    this.actionTypeLinkArray.push(newFormGroup);
    this.precedenceConstraintValueChangeSubscriptions.push(
      this.subscribeToFormControlProperty(newFormGroup, 'PrecedenceConstraintRequestActionTypeIDValue', 'PrecedenceConstraintLogicalOperatorIsORFlag'));
    this.frmServiceTypeActionTypeEdit.markAsDirty();
  }

  removeActionTypeLink(i: number) {
    //find keywords / search term to be deleted by index
    const serviceTypeRequestActionTypeLinkID = this.actionTypeLinkArray.at(i).get('ServiceTypeRequestActionTypeLinkID').value;
    //add ServiceTypeSearchKeywordID to deletedSearchTermIDs array only if it is an existing key word (id is greater than zero)
    serviceTypeRequestActionTypeLinkID > 0 ? this.deletedActionTypeLinkIDs.push(serviceTypeRequestActionTypeLinkID) : null;
    //remove related form group from form array
    this.actionTypeLinkArray.removeAt(i);
    this.frmServiceTypeActionTypeEdit.markAsDirty();
  }

  subscribeToFormChanges() {
      //subscribe to each PrecedenceConstraintRequestActionTypeIDValue value changes in form array
      this.actionTypeLinkArray.controls.forEach(control =>
      this.precedenceConstraintValueChangeSubscriptions.push(
        this.subscribeToFormControlProperty(control, 'PrecedenceConstraintRequestActionTypeIDValue', 'PrecedenceConstraintLogicalOperatorIsORFlag')));
  }

  subscribeToFormControlProperty(controlThatChanged : AbstractControl, controlPropertyToObserve: string, controlPropertyThatReacts: string): Subscription {
    return controlThatChanged.get(controlPropertyToObserve).valueChanges
    .debounceTime(500)
    .subscribe(observedValue => this.onValueChange(controlThatChanged, observedValue, controlPropertyThatReacts),
      err => this.exceptionService.catchBadResponse(err),
      () => console.log(`completed ${controlPropertyToObserve} subscriptions`));
  }

  onValueChange(control: AbstractControl, observedValue: any, controlPropertyThatReacts: string) {
      let ctrl = control.get(controlPropertyThatReacts);

      if(observedValue){
          ctrl.enable();
      }
      else
      {
        ctrl.setValue('');
        ctrl.disable();
      }
  }

  unsubscribeFromObservables() {
    //unsubscribe to each PrecedenceConstraintRequestActionTypeIDValue subscription
    this.precedenceConstraintValueChangeSubscriptions.forEach(x=>x.unsubscribe());
  }

  saveActionTypeLinks() {

    if (this.frmServiceTypeActionTypeEdit.valid && this.frmServiceTypeActionTypeEdit.dirty) {
    this.generalService.toggleSaveButtonMode();

    let containerModel = new ServiceTypeActionTypeLinkContainerModel();
    containerModel.DeletedActionTypeLinkIDs = this.deletedActionTypeLinkIDs;
    containerModel.ServiceTypeID = this.paramID;
    containerModel.ServiceTypeActionTypeLinkUpdateModel = this.actionTypeLinkArray.value;

    this.serviceTypeRequestActionTypeLinkService.addUpdateServiceTypeRequestActionTypeLinks(this.odataParams, containerModel)
      .subscribe((res)=> this.onSaveComplete(res, 'Updated action types linked to this service type.'),
      (err)=> this.generalService.toggleSaveButtonMode(),
      ()=> console.log('completed addUpdateServiceTypeRequestActionTypeLinks subscription'))
    }
  }

  clearArrays(){
      this.frmServiceTypeActionTypeEdit.controls['serviceTypeRequestActionTypeLinks'] = this.fb.array([]);
      this.deletedActionTypeLinkIDs = [];
  }

  onSaveComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      this.toastManager.success(saveMsg, 'Success!');
      this.clearArrays();
      this.onServiceTypeRequestActionTypeLinksRetrieval(value);
    }
    this.generalService.toggleSaveButtonMode();
  }

  goBack(): void {
    this.location.back();
  }

}

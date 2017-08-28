import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { ExceptionService, EntityService, GeneralService } from '../../infrastructure';
import { ServiceTypeService, ServiceTypeOwnerGroupService, RequestStatusService, RequestOriginService, ServiceTypeRelationshipDefinitionService } from '../../api';
import { IServiceType, IServiceTypeOwnerGroup, IRequestStatus, IRequestFolioType, IRequestOrigin } from '../../models';
import { ServiceTypeEditService } from '../shared/services/servicetype-edit.service';


function fnMonthDayRangeValidator(c: AbstractControl): { [key: string]: boolean } | null {
  let ctlFrom = c.get('ServiceTypeOwnerGroupOverrideMonthDayFrom');
  let ctlTo = c.get('ServiceTypeOwnerGroupOverrideMonthDayTo');

  if (ctlFrom.value && ctlTo.value) {
    let monthFrom = +ctlFrom.value.substring(0, 2);
    let dayFrom = +ctlFrom.value.substring(2, 4);
    //ignore year
    let dFrom = new Date(2017, (+monthFrom - 1), +dayFrom);

    //prevent 0229 inputs for feb 29
    if (monthFrom == 2 && dayFrom > 28) {
      return { 'monthDay': true }
    }

    if (dFrom.getDate() !== dayFrom) {
      return { 'monthDay': true }
    }

    let monthTo = +ctlTo.value.substring(0, 2);
    let dayTo = +ctlTo.value.substring(2, 4);
    let dTo = new Date(2017, (+monthTo - 1), +dayTo);

    //prevent 0229 inputs for feb 29
    if (monthTo == 2 && dayTo > 28) {
      return { 'monthDay': true }
    }

    if (dTo.getDate() !== dayTo) {
      return { 'monthDay': true }
    }

    //make sure date From is before date To
    if (dFrom >= dTo) {
      return { 'monthDay': true }
    }
  }
}

@Component({
  selector: 'app-servicetype-edit',
  templateUrl: './servicetype-edit.component.html',
  styleUrls: ['./servicetype-edit.component.css']
})
export class ServiceTypeEditComponent implements OnInit, OnDestroy {

  private paramID: number = null;
  private frmServiceTypeEdit: FormGroup;
  private serviceType: IServiceType;
  private assignBasedOnTimePeriodSubscription: Subscription
  private originValueChangeSubscription: Subscription;
  private incPropInfoValueChangeSubscription: Subscription;
  private requestFolioTypeSubscription: Subscription;
  private serviceTypeIsParent: boolean = false;
  private requestStatuses: IRequestStatus[];
  private requestOrigins: IRequestOrigin[];
  private serviceTypeOwnerGroups: IServiceTypeOwnerGroup[];
  private requestFolioTypes: IRequestFolioType[] = [{ RequestFolioTypeID: null, RequestFolioTypeName: "No Preference" },
  { RequestFolioTypeID: 1, RequestFolioTypeName: "Real Property" },
  { RequestFolioTypeID: 2, RequestFolioTypeName: "Personal Property" }];

  constructor(private fb: FormBuilder,
    private serviceTypeEditService: ServiceTypeEditService,
    private generalService: GeneralService,
    private entityService: EntityService,
    private toastManager: ToastsManager,
    private serviceTypeService: ServiceTypeService,
    private exceptionService: ExceptionService,
    private serviceTypeOwnerGroupService: ServiceTypeOwnerGroupService,
    private requestOriginService: RequestOriginService,
    private requestStatusService: RequestStatusService,
    private serviceTypeRelationshipDefinitionService: ServiceTypeRelationshipDefinitionService,
    private route: Router,
    private location: Location) { }

  ngOnInit() {

    this.getRequestStatusList();
    this.getRequestServiceTypeOwnerGroupList();
    this.getRequestOriginList();
    this.initializeForm();
    this.generalService.subscribeToTooltipMessages();
  }

  ngOnDestroy() {
    this.unsubscribeFromObservables();
  }

  generateForm(serviceType: IServiceType) {

    this.frmServiceTypeEdit = this.fb.group({
      ServiceTypeName: [serviceType.ServiceTypeName, [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(50)]],
      ServiceTypeNumber: [serviceType.ServiceTypeNumber, [<any>Validators.required, <any>Validators.pattern('^[1-9][0-9]*')]],
      ServiceTypeDescription: [serviceType.ServiceTypeDescription, [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(255)]],
      ServiceTypeAvailableToActiveDirectoryGroupName: [serviceType.ServiceTypeAvailableToActiveDirectoryGroupName, [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(100)]],
      ServiceTypeDefaultDuration: [serviceType.ServiceTypeDefaultDuration, [<any>Validators.required, <any>Validators.pattern('^[1-9][0-9]*')]],
      ServiceTypeAssigneeDependantOnPropertyFlag: [serviceType.ServiceTypeAssigneeDependantOnPropertyFlag],
      ServiceTypeIncludePropertyInfoFlag: [serviceType.ServiceTypeIncludePropertyInfoFlag],
      ServiceTypeIncludeFirstActionCommentFlag: [serviceType.ServiceTypeIncludeFirstActionCommentFlag],
      ServiceTypeShowAsStandaloneServiceFlag: [serviceType.ServiceTypeShowAsStandaloneServiceFlag],
      SelectableOnServiceTypeUpdateFlag: [serviceType.SelectableOnServiceTypeUpdateFlag, [<any>Validators.required]],
      ServiceTypeConcurrentCreationOfChildrenFlag: [{ value: serviceType.ServiceTypeConcurrentCreationOfChildrenFlag, disabled: !this.serviceTypeIsParent }],
      ServiceTypeParentClosesWhenChildrenClosedFlag: [{ value: serviceType.ServiceTypeParentClosesWhenChildrenClosedFlag, disabled: !this.serviceTypeIsParent }],
      ForceRequestFolioType: [{ value: serviceType.ForceRequestFolioType, disabled: !serviceType.DefaultRequestFolioTypeID }],
      DefaultRequestStatusID: [(serviceType.DefaultRequestStatusID || ''), [<any>Validators.required]],
      ServiceTypeOwnerGroupID: [(serviceType.ServiceTypeOwnerGroupID || ''), [<any>Validators.required]],
      EscalationExpectedStatusID: [(serviceType.EscalationExpectedStatusID || ''), [<any>Validators.required]],
      DefaultRequestFolioTypeID: [{ value: (serviceType.DefaultRequestFolioTypeID || null), disabled: serviceType.ServiceTypeAssigneeDependantOnPropertyFlag }],
      ServiceTypeAssigneeDependantOnOriginFlag: [serviceType.ServiceTypeAssigneeDependantOnOriginFlag],
      ServiceTypeDependantOriginID: [{ value: (serviceType.ServiceTypeDependantOriginID || ''), disabled: !serviceType.ServiceTypeAssigneeDependantOnOriginFlag }, [<any>Validators.required]],
      ServiceTypeOwnerGroupOverrideOriginBased: [{ value: (serviceType.ServiceTypeOwnerGroupOverrideOriginBased || ''), disabled: !serviceType.ServiceTypeAssigneeDependantOnOriginFlag }, [<any>Validators.required]],
      TimeBasedAssignment: this.fb.group({
        AssignBasedOnTimePeriod: [ serviceType.ServiceTypeOwnerGroupOverrideID],
        ServiceTypeOwnerGroupOverrideMonthDayFrom: [{ value: serviceType.ServiceTypeOwnerGroupOverrideMonthDayFrom, disabled:!serviceType.ServiceTypeOwnerGroupOverrideID}, [<any>Validators.required, <any>Validators.minLength(4), <any>Validators.maxLength(4)]],
        ServiceTypeOwnerGroupOverrideMonthDayTo: [{value: serviceType.ServiceTypeOwnerGroupOverrideMonthDayTo, disabled:!serviceType.ServiceTypeOwnerGroupOverrideID}, [<any>Validators.required, <any>Validators.minLength(4), <any>Validators.maxLength(4)]],
        ServiceTypeOwnerGroupOverrideID: [{value : (serviceType.ServiceTypeOwnerGroupOverrideID || ''), disabled:!serviceType.ServiceTypeOwnerGroupOverrideID}, [<any>Validators.required]]
      }, { validator: fnMonthDayRangeValidator })
    });

    this.subscribeToFormChanges();
  }

  subscribeToFormChanges() {

    //subscribe to ServiceTypeIncludePropertyInfoFlag boolean value changes
    this.incPropInfoValueChangeSubscription = this.frmServiceTypeEdit.get('ServiceTypeIncludePropertyInfoFlag').valueChanges
      .subscribe(value => this.onPropertyDependencyChange(value),
      err => this.exceptionService.catchBadResponse(err),
      () => console.log('completed ServiceTypeIncludePropertyInfoFlag subscription'));

    //subscribe to ServiceTypeAssigneeDependantOnOriginFlag boolean value changes
    this.originValueChangeSubscription = this.frmServiceTypeEdit.get('ServiceTypeAssigneeDependantOnOriginFlag').valueChanges
      .subscribe(value => this.onOriginDependencyChange(value),
      err => this.exceptionService.catchBadResponse(err),
      () => console.log('completed ServiceTypeAssigneeDependantOnOriginFlag subscription'));

    //subscribe to DefaultRequestFolioTypeID int value changes
    this.requestFolioTypeSubscription = this.frmServiceTypeEdit.get('DefaultRequestFolioTypeID').valueChanges
      .subscribe(value => this.onFolioTypeSelection(value),
      err => this.exceptionService.catchBadResponse(err),
      () => console.log('completed DefaultRequestFolioTypeID subscription'));

    //subscribe to AssignBasedOnTimePeriod boolean value changes
    this.assignBasedOnTimePeriodSubscription = this.frmServiceTypeEdit.get('TimeBasedAssignment.AssignBasedOnTimePeriod').valueChanges
      .subscribe(value => this.onAssignBasedOnTimePeriodChange(value),
      err => this.exceptionService.catchBadResponse(err),
      () => console.log('completed DefaultRequestFolioTypeID subscription'));
  }

  unsubscribeFromObservables() {
    this.incPropInfoValueChangeSubscription.unsubscribe();
    this.originValueChangeSubscription.unsubscribe();
    this.requestFolioTypeSubscription.unsubscribe();
    this.assignBasedOnTimePeriodSubscription.unsubscribe();
    this.generalService.unsubscribeFromTooltipMessages();
  }

  initializeForm() {
    this.paramID = this.serviceTypeEditService.getServiceTypeIDParam();
    this.getIsParentRequest(this.paramID);
  }

  getServiceTypeByID(serviceTypeID: number) {
    //remove metadata from response
    const odataParams: string = `?$format=application/json;odata.metadata=none`;
    this.serviceTypeService.getServiceType(serviceTypeID, odataParams)
      .subscribe((data: IServiceType) => {
        this.serviceType = data;
        this.generateForm(this.serviceType);
      },
      err => console.log(err),
      () => console.log('completed subscription to getServiceType'));
  }

  getIsParentRequest(serviceTypeID: number) {
    this.serviceTypeRelationshipDefinitionService.hasDependantServiceTypesAndCacheResult(serviceTypeID)
      .subscribe((data: boolean) => {
        this.serviceTypeIsParent = data;
        this.getServiceTypeByID(serviceTypeID);
      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed hasDependantServiceTypes subscription');
      });
  }

  getRequestStatusList() {
    this.requestStatuses = [];

    const odataParams: string = `?$select=RequestStatusName, RequestStatusID&$filter=(SystemReservedFlag eq false) and (AdmIsActive eq 'Y')&$orderby=RequestStatusName`;
    this.requestStatusService.getRequestStatusesAndCacheResult(odataParams)
      .subscribe(data => {
        this.requestStatuses = data;
      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed getRequestStatusesAndCacheResult subscription');
      });
  }

  getRequestServiceTypeOwnerGroupList() {
    this.serviceTypeOwnerGroups = [];
    //Explicit exclusion of ServiceTypeOwnerGroup 'ServiceTypeRoot' in odataParam $filter; This ServiceTypeOwnerGroup should never have a ServiceType assigned to it
    const odataParams: string = `?$select=ServiceTypeOwnerGroupName, ServiceTypeOwnerGroupID, SelectableOnRequestCreationFlag, SelectableOnRequestReassignmentFlag
                                &$filter=(ServiceTypeOwnerGroupID ne D21A155F-5A10-4017-A581-7742FDC51DE0) and (AdmIsActive eq 'Y')&$orderby=ServiceTypeOwnerGroupName`;
    this.serviceTypeOwnerGroupService.getServiceTypeOwnerGroups(odataParams)
      .subscribe(data => {
        this.serviceTypeOwnerGroups = data;
      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed serviceTypeOwnerGroupService subscription');
      });
  }

  getRequestOriginList() {
    this.requestOrigins = [];

    const odataParams: string = `?$select=RequestOriginName,RequestOriginID&$filter=(AdmIsActive eq 'Y')&$orderby=RequestOriginName`;
    this.requestOriginService.getRequestOriginsAndCacheResult(odataParams)
      .subscribe(data => {
        this.requestOrigins = data;
      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed requestOriginsService subscription');
      });
  }

  onPropertyDependencyChange(includePropInfo: boolean): void {

    let ctrlDefaultPropertyType = this.frmServiceTypeEdit.get('DefaultRequestFolioTypeID');
    let ctrlProperytBasedAssignee = this.frmServiceTypeEdit.get('ServiceTypeAssigneeDependantOnPropertyFlag');
    let ctrlEnforcePreferredProperty = this.frmServiceTypeEdit.get('ForceRequestFolioType');

    if (includePropInfo) {

      ctrlDefaultPropertyType.enable();
      ctrlProperytBasedAssignee.enable();
    }
    else {
      ctrlDefaultPropertyType.setValue(null);
      ctrlDefaultPropertyType.disable();

      ctrlEnforcePreferredProperty.setValue(false);
      ctrlEnforcePreferredProperty.disable();

      ctrlProperytBasedAssignee.disable();

    }
  }

  onOriginDependencyChange(assignBasedOnOrigin: boolean): void {

    //enable or disable section based on ServiceTypeAssigneeDependantOnOriginFlag flag
    let ctrlOriginGroup = this.frmServiceTypeEdit.get('ServiceTypeOwnerGroupOverrideOriginBased');
    let ctrlOrigin = this.frmServiceTypeEdit.get('ServiceTypeDependantOriginID');

    if (assignBasedOnOrigin) {
      ctrlOriginGroup.enable();
      ctrlOrigin.enable();
    }
    else {
      ctrlOriginGroup.setValue('');
      ctrlOriginGroup.disable();

      ctrlOrigin.setValue('');
      ctrlOrigin.disable();
    }
  }

  onFolioTypeSelection(requestFolioTypeID: any) {
    //enable or disable ForceRequestFolioType control based on whether DefaultRequestFolioTypeID has a value
    let ctrlEnforcePropertyTypeSelection = this.frmServiceTypeEdit.get('ForceRequestFolioType');
    isNaN(requestFolioTypeID) ? ctrlEnforcePropertyTypeSelection.disable() : ctrlEnforcePropertyTypeSelection.enable();
  }

  onAssignBasedOnTimePeriodChange(assignBasedOnTimePeriod: boolean) {

    let ctrlServiceTypeOwnerGroupOverrideIDSelection = this.frmServiceTypeEdit.get('TimeBasedAssignment.ServiceTypeOwnerGroupOverrideID');
    let ctrlServiceTypeOwnerGroupOverrideMonthDayFrom = this.frmServiceTypeEdit.get('TimeBasedAssignment.ServiceTypeOwnerGroupOverrideMonthDayFrom');
    let ctrlServiceTypeOwnerGroupOverrideMonthDayTo = this.frmServiceTypeEdit.get('TimeBasedAssignment.ServiceTypeOwnerGroupOverrideMonthDayTo');

    if (assignBasedOnTimePeriod) {
      ctrlServiceTypeOwnerGroupOverrideIDSelection.enable();
      ctrlServiceTypeOwnerGroupOverrideMonthDayFrom.enable();
      ctrlServiceTypeOwnerGroupOverrideMonthDayTo.enable();
    }
    else {
      ctrlServiceTypeOwnerGroupOverrideIDSelection.setValue('');
      ctrlServiceTypeOwnerGroupOverrideIDSelection.disable();

      ctrlServiceTypeOwnerGroupOverrideMonthDayFrom.setValue(null);
      ctrlServiceTypeOwnerGroupOverrideMonthDayFrom.disable();

      ctrlServiceTypeOwnerGroupOverrideMonthDayTo.setValue(null);
      ctrlServiceTypeOwnerGroupOverrideMonthDayTo.disable();
    }
  }

  getToolTipMessage(group: IServiceTypeOwnerGroup): string {
    //business area dropdown box, alert user for each select list item of ServiceTypeOwnerGroup visibility on creation and reassignment
    if (group.SelectableOnRequestCreationFlag && group.SelectableOnRequestReassignmentFlag) {
      return 'Business area is available on PSR creation and reassignment.';
    }
    else if (group.SelectableOnRequestCreationFlag) {
      return 'Business area is available on PSR creation only.';
    }
    else if (group.SelectableOnRequestReassignmentFlag) {
      return 'Business area is available on PSR reassignment only.';
    }
  }

  saveServiceType(): void {

    if (this.frmServiceTypeEdit.dirty && this.frmServiceTypeEdit.valid) {

      this.generalService.toggleSaveButtonMode();

      //assign form properties to servicetype object via ES6 destructuring (just cause it's cool)
      ({
        ServiceTypeName: this.serviceType.ServiceTypeName,
        ServiceTypeNumber: this.serviceType.ServiceTypeNumber,
        ServiceTypeDescription: this.serviceType.ServiceTypeDescription,
        ServiceTypeAvailableToActiveDirectoryGroupName: this.serviceType.ServiceTypeAvailableToActiveDirectoryGroupName,
        ServiceTypeDefaultDuration: this.serviceType.ServiceTypeDefaultDuration,
        ServiceTypeAssigneeDependantOnPropertyFlag: this.serviceType.ServiceTypeAssigneeDependantOnPropertyFlag,
        ServiceTypeIncludePropertyInfoFlag: this.serviceType.ServiceTypeIncludePropertyInfoFlag,
        ServiceTypeIncludeFirstActionCommentFlag: this.serviceType.ServiceTypeIncludeFirstActionCommentFlag,
        ServiceTypeShowAsStandaloneServiceFlag: this.serviceType.ServiceTypeShowAsStandaloneServiceFlag,
        SelectableOnServiceTypeUpdateFlag: this.serviceType.SelectableOnServiceTypeUpdateFlag,
        DefaultRequestStatusID: this.serviceType.DefaultRequestStatusID,
        ServiceTypeOwnerGroupID: this.serviceType.ServiceTypeOwnerGroupID,
        EscalationExpectedStatusID: this.serviceType.EscalationExpectedStatusID,
        ServiceTypeAssigneeDependantOnOriginFlag: this.serviceType.ServiceTypeAssigneeDependantOnOriginFlag,
        ServiceTypeDependantOriginID: this.serviceType.ServiceTypeDependantOriginID,
        ServiceTypeOwnerGroupOverrideOriginBased: this.serviceType.ServiceTypeOwnerGroupOverrideOriginBased,
        TimeBasedAssignment: {
          ServiceTypeOwnerGroupOverrideMonthDayFrom: this.serviceType.ServiceTypeOwnerGroupOverrideMonthDayFrom,
          ServiceTypeOwnerGroupOverrideMonthDayTo: this.serviceType.ServiceTypeOwnerGroupOverrideMonthDayTo,
          ServiceTypeOwnerGroupOverrideID: this.serviceType.ServiceTypeOwnerGroupOverrideID
        }
      } = this.frmServiceTypeEdit.value);

      //NOT cool: temp fix: ctrlAssignBasedOnTimPeriod disables the controls AND removes the control from the form object
      //therefore, applied temp fix below until I can get a more permanent solution or Roberto finds one
      let ctrlAssignBasedOnTimPeriod = this.frmServiceTypeEdit.get('TimeBasedAssignment.AssignBasedOnTimePeriod');

      if (!ctrlAssignBasedOnTimPeriod.value) {
        this.serviceType.ServiceTypeOwnerGroupOverrideID = null;
        this.serviceType.ServiceTypeOwnerGroupOverrideMonthDayFrom = null;
        this.serviceType.ServiceTypeOwnerGroupOverrideMonthDayTo = null;
      }

      this.paramID === 0 ? this.createServiceType(this.serviceType) : this.updateServiceType(this.serviceType);
    }
  }

  createServiceType(serviceType: IServiceType): void {

    this.serviceTypeService.addServiceType(serviceType)
      .subscribe(
      (value: any) => { this.onSaveComplete(value, `Successfully created Service Type: ${serviceType.ServiceTypeName}.`); },
      (err) => { this.generalService.toggleSaveButtonMode() },
      () => { console.log('completed serviceTypeService add subscription.'); });
  }

  updateServiceType(serviceType: IServiceType): void {

    this.serviceTypeService.updateServiceType(serviceType)
      .subscribe(
      (value: any) => { this.onSaveComplete(value, `Successfully updated Service Type: ${serviceType.ServiceTypeName}.`); },
      (err) => { this.generalService.toggleSaveButtonMode() },
      () => { console.log('completed serviceTypeService update subscription.'); });

  }

  onSaveComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      this.toastManager.success(saveMsg, 'Success!');
      //navigate to newly created servicetype
      this.route.navigate(['/ServiceTypes', value]);
    }

    this.generalService.toggleSaveButtonMode();
  }

  goBack(): void {
    this.location.back();
  }
}

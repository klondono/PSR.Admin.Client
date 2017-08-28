import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription'

import { ServiceTypeCustomFieldService, CustomFieldTypeService, CustomFieldDataTypeService  } from '../../api';
import { IServiceTypeCustomField, ICustomFieldDataType, ICustomFieldType, IDropdownListType } from '../../models';
import { ServiceTypeEditService } from '../shared/services/servicetype-edit.service';
import { ExceptionService, EntityService, ModalService, GeneralService } from '../../infrastructure';

@Component({
  selector: 'app-servicetype-customfield-edit-component',
  templateUrl: './servicetype-customfield-edit.component.html',
  styleUrls: ['./servicetype-customfield-edit.component.css']
})
export class ServiceTypeCustomFieldEditComponent implements OnInit, OnDestroy {

  private paramID: number = null;
  private addEditMode: string = 'Add Custom Field';
  private frmServiceTypeCustomFieldEdit: FormGroup;
  private fieldTypeSubscription: Subscription;
  private customField: IServiceTypeCustomField;
  private customFields: IServiceTypeCustomField[] = [];
  private customFieldTypes: ICustomFieldType[] = [];
  private customFieldDataTypes: ICustomFieldDataType[] = [];
  private requiredFieldOptions: IDropdownListType[] = [{ BlnValue: true, Label: "Required" },
  { BlnValue: false, Label: "Optional" }];
  private textAlignmentOptions: IDropdownListType[] = [{ StrValue: 'left', Label: "Left" },
  { StrValue: 'right', Label: "Right" },
  { StrValue: 'center', Label: "Center" }];
  private odataParams: string = ``;

  constructor(private fb: FormBuilder,
    private toastManager: ToastsManager,
    private location: Location,
    private generalService: GeneralService,
    private modalService: ModalService,
    private exceptionService: ExceptionService,
    private entityService: EntityService,
    private serviceTypeEditService: ServiceTypeEditService,
    private customFieldTypeService: CustomFieldTypeService,
    private customFieldDataTypeService: CustomFieldDataTypeService,
    private serviceTypeCustomFieldService: ServiceTypeCustomFieldService) { }

  ngOnInit() {
    this.initializeForm();
    this.generalService.subscribeToTooltipMessages('ServiceTypeCustomField');
  }

  ngOnDestroy(){
    this.unsubscribeFromObservables();
    this.generalService.unsubscribeFromTooltipMessages();
  }

  initializeForm() {
    this.paramID = this.serviceTypeEditService.getServiceTypeIDParam();
    this.generateForm();
    this.getCustomFieldTypes();
    this.getCustomFieldDataTypes();
    this.getCustomFields(this.paramID);
    this.getCustomField(0);
  }

  generateForm() {

      this.frmServiceTypeCustomFieldEdit = this.fb.group({
          ServiceTypeID: this.paramID,
          LabelName:['', [<any>Validators.required, <any>Validators.maxLength(50)]],
          CustomFieldTypeID:['', [<any>Validators.required]],
          CustomFieldDataTypeID:['',[<any>Validators.required]],
          PlaceholderText:['', [<any>Validators.required]],
          TextAlignment:['', [<any>Validators.required]],
          InputSequence:['', [<any>Validators.required, <any>Validators.pattern('^[1-9][0-9]*')]],
          RequiredFlag:['', <any>Validators.required],
          TooltipMessage:['', [<any>Validators.required, <any>Validators.maxLength(255)]],
          GroupingIdentifier1:['', [<any>Validators.maxLength(25)]],
          GroupingIdentifier2:['', [<any>Validators.maxLength(25)]],
          Description:['', [<any>Validators.maxLength(500)]]
    });

    this.subscribeToFormChanges();
  }

  setFormValues(customField : IServiceTypeCustomField){

    this.frmServiceTypeCustomFieldEdit.patchValue({
          ServiceTypeID: this.paramID,
          LabelName:customField.LabelName,
          CustomFieldTypeID:customField.CustomFieldTypeID,
          CustomFieldDataTypeID:customField.CustomFieldDataTypeID,
          PlaceholderText:customField.PlaceholderText,
          TextAlignment:customField.TextAlignment,
          InputSequence:customField.InputSequence,
          RequiredFlag:customField.RequiredFlag,
          TooltipMessage:customField.TooltipMessage,
          GroupingIdentifier1:customField.GroupingIdentifier1,
          GroupingIdentifier2:customField.GroupingIdentifier2,
          Description:customField.Description
    })
  }

  subscribeToFormChanges() {

    //subscribe to CustomFieldTypeID value changes
    this.fieldTypeSubscription = this.frmServiceTypeCustomFieldEdit.get('CustomFieldTypeID').valueChanges
      .subscribe(value => this.onFieldTypeValueChange(value),
      err => this.exceptionService.catchBadResponse(err),
      () => console.log('completed fieldTypeSubscription subscription'));
  }

  unsubscribeFromObservables() {
    this.fieldTypeSubscription.unsubscribe();
  }

  onFieldTypeValueChange(value){

    let ctlDataType = this.frmServiceTypeCustomFieldEdit.get('CustomFieldDataTypeID');
    let ctlPlaceholder = this.frmServiceTypeCustomFieldEdit.get('PlaceholderText');
    let ctlTextAlign= this.frmServiceTypeCustomFieldEdit.get('TextAlignment');

    switch(+value) {
      //text
      case 1:
      ctlDataType.setValue(8);
      ctlDataType.enable();

      ctlTextAlign.enable();
      ctlPlaceholder.enable();
      break;
      //Radio yes no button
      case 2:
      ctlPlaceholder.setValue(null);
      ctlPlaceholder.disable();

      ctlDataType.setValue(8);
      ctlDataType.disable();

      ctlTextAlign.setValue('left');
      ctlTextAlign.disable();
      break;
      //Radio yes no n/a button
      case 3:
      ctlPlaceholder.setValue(null);
      ctlPlaceholder.disable();

      ctlDataType.setValue(8);
      ctlDataType.disable();

      ctlTextAlign.setValue('left');
      ctlTextAlign.disable();
      break;
      //date picker
      case 4:
      ctlPlaceholder.enable();

      ctlDataType.setValue(8);
      ctlDataType.disable();

      ctlTextAlign.enable();
      break;
      case 0:
      //do nothing and let form defaults take over
      break;
      default:
      ctlDataType.setValue(8);
      ctlDataType.disable();

      ctlTextAlign.setValue('left');
      ctlTextAlign.disable();

      ctlPlaceholder.enable();
    }

}

  getCustomFieldTypes() {
    let odataCFParams = `/?$filter=(AdmIsActive eq 'Y')&$select=CustomFieldTypeName, CustomFieldTypeID, CustomFieldTypeDescription`;
    this.customFieldTypeService.getCustomFieldTypes(odataCFParams).subscribe(
      (data: ICustomFieldType[]) => {
        this.customFieldTypes = data;
      },
      (err) => { console.error(err) },
      () => {console.log('completed getCustomFieldTypes subscription.') })
  }

  getCustomFieldDataTypes() {
    let odataCFTParams = `/?$filter=(AdmIsActive eq 'Y')&$select=CustomFieldDataTypeName, CustomFieldDataTypeID, CustomFieldDataTypeDescription &$orderby=CustomFieldDataTypeName`;
    this.customFieldDataTypeService.getCustomFieldDataTypes(odataCFTParams).subscribe(
      (data: ICustomFieldDataType[]) => {
        this.customFieldDataTypes = data;
      },
      (err) => { console.error(err) },
      () => {console.log('completed getCustomFieldDataTypes subscription.') })
  }

  getCustomField(customFieldID: number) {

    this.serviceTypeCustomFieldService
    //odata parameter removes additional metadata field from being returned with model
    .getServiceTypeCustomField(customFieldID, `/?$format=application/json;odata.metadata=none`).subscribe(
      (data: IServiceTypeCustomField) => {
        this.customField = data;
        this.addEditMode = this.customField.ServiceTypeID > 0 ?  `Edit ${this.customField.LabelName}` : `Add Custom Field`;
        this.setFormValues(this.customField);
      },
      (err) => { console.error(err) },
      () => {console.log('completed getServiceTypeCustomField subscription.') })
  }

  saveCustomField(): void {

    if (this.frmServiceTypeCustomFieldEdit.dirty && this.frmServiceTypeCustomFieldEdit.valid) {

        this.generalService.toggleSaveButtonMode();

        let customField : IServiceTypeCustomField = this.entityService.merge({}, this.customField, this.frmServiceTypeCustomFieldEdit.getRawValue());
        customField.ServiceTypeCustomFieldID === 0 ? this.createCustomField(customField) : this.updateCustomField(customField);
    }
  }

  createCustomField(newCustomField: IServiceTypeCustomField){

        this.serviceTypeCustomFieldService.addServiceTypeCustomField(newCustomField)
        .subscribe((value) => this.onSaveComplete(value, `Successfully created Custom Field: ${newCustomField.LabelName}.`),
        (err) => this.generalService.toggleSaveButtonMode(),
        () => console.log(`completed addServiceTypeCustomField subscription.`)
      )
  }

  updateCustomField(updatedCustomField: IServiceTypeCustomField){

      this.serviceTypeCustomFieldService.updateServiceTypeCustomField(updatedCustomField)
      .subscribe((value) => this.onSaveComplete(value, `Successfully updated Custom Field: ${updatedCustomField.LabelName}.`),
      (err) => this.generalService.toggleSaveButtonMode(),
      () => console.log(`completed updateServiceTypeCustomField subscription.`)
      )
  }

  onSaveComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      this.toastManager.success(saveMsg, 'Success!');
      this.frmServiceTypeCustomFieldEdit.reset();
      this.getCustomField(0);
      this.getCustomFields(this.paramID);
    }

    this.generalService.toggleSaveButtonMode();
  }

  deleteCustomField(customField: IServiceTypeCustomField): void {
    this.showConfirmDeleteModal(`Are you sure you wish to delete custom field?`,
    `Delete ${customField.LabelName}`, customField);
  }

  showConfirmDeleteModal(message: string, title: string, customField: IServiceTypeCustomField) {
    this.modalService.activate(message, title, 'Yes', 'Cancel').then(responseOK => {
      if (responseOK) {
          this.deleteConfirmed(customField);
      }
    });
  }

  deleteConfirmed(customField: IServiceTypeCustomField){

    this.serviceTypeCustomFieldService.deleteServiceTypeCustomField(customField.ServiceTypeCustomFieldID)
    .subscribe((value) => this.onDeleteComplete(value, `${customField.LabelName} was deleted succesfully.`),
                (err) => this.generalService.toggleSaveButtonMode(),
                () => console.log(`completed deleteServiceTypeCustomField subscription.`))
  }

  onDeleteComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      this.toastManager.success(saveMsg, 'Success!');
      this.getCustomFields(this.paramID);
      this.getCustomField(0);
    }
  }

  getCustomFields(serviceTypeID: number) {

    this.odataParams = `/?$filter=(ServiceTypeID eq ${serviceTypeID} and AdmIsActive eq 'Y')&$expand=CustomFieldType($expand=CustomFieldSelectListItems),CustomFieldDataType&$orderby=InputSequence&$format=application/json;odata.metadata=none`

    this.serviceTypeCustomFieldService.getServiceTypeCustomFields(this.odataParams).subscribe(
      (data: IServiceTypeCustomField[]) => {
        this.customFields = data;
      },
      (err) => { console.error(err) },
      () => {console.log('completed getServiceTypeCustomFields subscription.') })
  }

  goBack(): void {
    this.location.back();
  }

}

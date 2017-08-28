import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription'

import { RequestActionTypeCustomFieldService, CustomFieldTypeService, CustomFieldDataTypeService  } from '../../api';
import { IRequestActionTypeCustomField, ICustomFieldDataType, ICustomFieldType, IDropdownListType } from '../../models';
import { ActionTypeEditService } from '../shared/services/actiontype-edit.service';
import { ExceptionService, EntityService, ModalService, GeneralService } from '../../infrastructure';

@Component({
  selector: 'app-actiontype-customfield-edit',
  templateUrl: './actiontype-customfield-edit.component.html',
  styleUrls: ['./actiontype-customfield-edit.component.css']
})
export class ActionTypeCustomFieldEditComponent implements OnInit {

  private paramID: number = null;
  private addEditMode: string = 'Add Custom Field';
  private frmActionTypeCustomField: FormGroup;
  private fieldTypeSubscription: Subscription;
  private customField: IRequestActionTypeCustomField;
  private customFields: IRequestActionTypeCustomField[] = [];
  private customFieldTypes: ICustomFieldType[] = [];
  private customFieldDataTypes: ICustomFieldDataType[] = [];
  private requiredFieldOptions: IDropdownListType[] = [{ BlnValue: true, Label: "Required" },
  { BlnValue: false, Label: "Optional" }];
  private valueInCommentsFieldOptions: IDropdownListType[] = [{ BlnValue: true, Label: "True" },
  { BlnValue: false, Label: "False" }];
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
    private actionTypeEditService: ActionTypeEditService,
    private customFieldTypeService: CustomFieldTypeService,
    private customFieldDataTypeService: CustomFieldDataTypeService,
    private actionTypeCustomFieldService: RequestActionTypeCustomFieldService) { }

  ngOnInit() {
    this.initializeForm();
    this.generalService.subscribeToTooltipMessages('RequestActionTypeCustomField');
  }

  ngOnDestroy(){
    this.unsubscribeFromObservables();
    this.generalService.unsubscribeFromTooltipMessages();
  }

  initializeForm() {
    this.paramID = this.actionTypeEditService.getActionTypeIDParam();
    this.generateForm();
    this.getCustomFieldTypes();
    this.getCustomFieldDataTypes();
    this.getCustomFields(this.paramID);
    this.getCustomField(0);
  }

  generateForm() {

      this.frmActionTypeCustomField = this.fb.group({
          RequestActionTypeID: this.paramID,
          LabelName:['', [<any>Validators.required, <any>Validators.maxLength(50)]],
          CustomFieldTypeID:['', [<any>Validators.required]],
          CustomFieldDataTypeID:['',[<any>Validators.required]],
          PlaceholderText:['', [<any>Validators.required]],
          TextAlignment:['', [<any>Validators.required]],
          InputSequence:['', [<any>Validators.required, <any>Validators.pattern('^[1-9][0-9]*')]],
          RequiredFlag:['', <any>Validators.required],
          DisplayFieldValueInCommentsFlag: ['', <any>Validators.required],
          TooltipMessage:['', [<any>Validators.required, <any>Validators.maxLength(255)]],
          GroupingIdentifier1:['', [<any>Validators.maxLength(25)]],
          GroupingIdentifier2:['', [<any>Validators.maxLength(25)]],
          Description:['', [<any>Validators.maxLength(500)]]
    });

    this.subscribeToFormChanges();
  }

  setFormValues(customField : IRequestActionTypeCustomField){

    this.frmActionTypeCustomField.patchValue({
          RequestActionTypeID: this.paramID,
          LabelName:customField.LabelName,
          CustomFieldTypeID:customField.CustomFieldTypeID,
          CustomFieldDataTypeID:customField.CustomFieldDataTypeID,
          PlaceholderText:customField.PlaceholderText,
          TextAlignment:customField.TextAlignment,
          InputSequence:customField.InputSequence,
          RequiredFlag:customField.RequiredFlag,
          DisplayFieldValueInCommentsFlag: customField.DisplayFieldValueInCommentsFlag,
          TooltipMessage:customField.TooltipMessage,
          GroupingIdentifier1:customField.GroupingIdentifier1,
          GroupingIdentifier2:customField.GroupingIdentifier2,
          Description:customField.Description
    })
  }

  subscribeToFormChanges() {

    //subscribe to CustomFieldTypeID value changes
    this.fieldTypeSubscription = this.frmActionTypeCustomField.get('CustomFieldTypeID').valueChanges
      .subscribe(value => this.onFieldTypeValueChange(value),
      err => this.exceptionService.catchBadResponse(err),
      () => console.log('completed fieldTypeSubscription subscription'));
  }

  unsubscribeFromObservables() {
    this.fieldTypeSubscription.unsubscribe();
  }

  onFieldTypeValueChange(value){

    let ctlDataType = this.frmActionTypeCustomField.get('CustomFieldDataTypeID');
    let ctlPlaceholder = this.frmActionTypeCustomField.get('PlaceholderText');
    let ctlTextAlign= this.frmActionTypeCustomField.get('TextAlignment');
    let ctlDisplayListComments= this.frmActionTypeCustomField.get('DisplayFieldValueInCommentsFlag');

    switch(+value) {
      //text
      case 1:
      ctlDataType.setValue(8);
      ctlDataType.enable();

      ctlTextAlign.enable();
      ctlPlaceholder.enable();

      ctlDisplayListComments.setValue(false);
      ctlDisplayListComments.disable();
      break;
      //Radio yes no button
      case 2:
      ctlPlaceholder.setValue(null);
      ctlPlaceholder.disable();

      ctlDataType.setValue(8);
      ctlDataType.disable();

      ctlDisplayListComments.setValue(false);
      ctlDisplayListComments.disable();

      ctlTextAlign.setValue('left');
      ctlTextAlign.disable();
      break;
      //Radio yes no n/a button
      case 3:
      ctlPlaceholder.setValue(null);
      ctlPlaceholder.disable();

      ctlDataType.setValue(8);
      ctlDataType.disable();

      ctlDisplayListComments.setValue(false);
      ctlDisplayListComments.disable();

      ctlTextAlign.setValue('left');
      ctlTextAlign.disable();
      break;
      //date picker
      case 4:
      ctlPlaceholder.enable();

      ctlDataType.setValue(8);
      ctlDataType.disable();

      ctlDisplayListComments.setValue(false);
      ctlDisplayListComments.disable();

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

      ctlDisplayListComments.enable();
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

    this.actionTypeCustomFieldService
    //odata parameter removes additional metadata field from being returned with model
    .getActionTypeCustomField(customFieldID, `/?$format=application/json;odata.metadata=none`).subscribe(
      (data: IRequestActionTypeCustomField) => {
        this.customField = data;
        this.addEditMode = this.customField.RequestActionTypeID > 0 ?  `Edit ${this.customField.LabelName}` : `Add Custom Field`;
        this.setFormValues(this.customField);
      },
      (err) => { console.error(err) },
      () => {console.log('completed getServiceTypeCustomField subscription.') })
  }

  saveCustomField(): void {

    if (this.frmActionTypeCustomField.dirty && this.frmActionTypeCustomField.valid) {

        this.generalService.toggleSaveButtonMode();

        let customField : IRequestActionTypeCustomField = this.entityService.merge({}, this.customField, this.frmActionTypeCustomField.getRawValue());
        customField.RequestActionTypeCustomFieldID === 0 ? this.createCustomField(customField) : this.updateCustomField(customField);
    }
  }

  createCustomField(newCustomField: IRequestActionTypeCustomField){

        this.actionTypeCustomFieldService.addActionTypeCustomField(newCustomField)
        .subscribe((value) => this.onSaveComplete(value, `Successfully created Custom Field: ${newCustomField.LabelName}.`),
        (err) => this.generalService.toggleSaveButtonMode(),
        () => console.log(`completed actionTypeCustomFieldService subscription.`)
      )
  }

  updateCustomField(updatedCustomField: IRequestActionTypeCustomField){

      this.actionTypeCustomFieldService.updateActionTypeCustomField(updatedCustomField)
      .subscribe((value) => this.onSaveComplete(value, `Successfully updated Custom Field: ${updatedCustomField.LabelName}.`),
      (err) => this.generalService.toggleSaveButtonMode(),
      () => console.log(`completed actionTypeCustomFieldService subscription.`)
      )
  }

  onSaveComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      this.toastManager.success(saveMsg, 'Success!');
      this.frmActionTypeCustomField.reset();
      this.getCustomField(0);
      this.getCustomFields(this.paramID);
    }

    this.generalService.toggleSaveButtonMode();
  }

  deleteCustomField(customField: IRequestActionTypeCustomField): void {
    this.showConfirmDeleteModal(`Are you sure you wish to delete custom field?`,
    `Delete ${customField.LabelName}`, customField);
  }

  showConfirmDeleteModal(message: string, title: string, customField: IRequestActionTypeCustomField) {
    this.modalService.activate(message, title, 'Yes', 'Cancel').then(responseOK => {
      if (responseOK) {
          this.deleteConfirmed(customField);
      }
    });
  }

  deleteConfirmed(customField: IRequestActionTypeCustomField){

    this.actionTypeCustomFieldService.deleteActionTypeCustomField(customField.RequestActionTypeCustomFieldID)
    .subscribe((value) => this.onDeleteComplete(value, `${customField.LabelName} was deleted succesfully.`),
                (err) => this.generalService.toggleSaveButtonMode(),
                () => console.log(`completed actionTypeCustomFieldService subscription.`))
  }

  onDeleteComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      this.toastManager.success(saveMsg, 'Success!');
      this.getCustomFields(this.paramID);
      this.getCustomField(0);
    }
  }

  getCustomFields(requestActionTypeID: number) {

    this.odataParams = `/?$filter=(RequestActionTypeID eq ${requestActionTypeID} and AdmIsActive eq 'Y')&$expand=CustomFieldType($expand=CustomFieldSelectListItems),CustomFieldDataType&$orderby=InputSequence&$format=application/json;odata.metadata=none`

    this.actionTypeCustomFieldService.getActionTypeCustomFields(this.odataParams).subscribe(
      (data: IRequestActionTypeCustomField[]) => {
        this.customFields = data;
      },
      (err) => { console.error(err) },
      () => {console.log('completed actionTypeCustomFieldService subscription.') })
  }

  goBack(): void {
    this.location.back();
  }

}


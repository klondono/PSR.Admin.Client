import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { RequestActionTypeService  } from '../../api';
import { IRequestActionType } from '../../models';
import { ActionTypeEditService } from '../shared/services/actiontype-edit.service';
import { ExceptionService, ModalService, GeneralService, EntityService } from '../../infrastructure';

@Component({
  selector: 'app-action-type-edit',
  templateUrl: './actiontype-edit.component.html',
  styleUrls: ['./actiontype-edit.component.css']
})
export class ActionTypeEditComponent implements OnInit, OnDestroy {

private paramID: number;
private frmActionTypeEdit: FormGroup
private actionType: IRequestActionType;
private backgroundColorChangeSubscription: Subscription;
private textColorChangeSubscription: Subscription;
private currentBackgroundColor: string;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private location: Location,
    private entityService: EntityService,
    private generalService: GeneralService,
    private toastManager: ToastsManager,
    private actionTypeEditService: ActionTypeEditService,
    private requestActionTypeService: RequestActionTypeService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.generalService.subscribeToTooltipMessages();
  }

  ngOnDestroy(){
    this.generalService.unsubscribeFromTooltipMessages();
  }

  // ngAfterContentInit(){
  // //   console.log('after')
  //       this.currentBackgroundColor = this.frmActionTypeEdit.get('BackgroundColor').value;
  //       this.onColorPickerChange(this.currentBackgroundColor);
  // }

  initializeForm() {
    this.paramID = this.actionTypeEditService.getActionTypeIDParam();
    this.generateForm();
    this.getActionType(this.paramID);
  }

  generateForm() {

      this.frmActionTypeEdit = this.fb.group({
          RequestActionTypeID: this.paramID,
          RequestActionTypeName:['', [<any>Validators.required, <any>Validators.maxLength(50)]],
          RequestActionTypeDescription:['', [<any>Validators.required, <any>Validators.maxLength(255)]],
          BackgroundColor:['',[<any>Validators.required, <any>Validators.maxLength(7)]],
          TextColor:['', [<any>Validators.required, <any>Validators.maxLength(7)]],
          ChangeRequestStatusFlag:['', [<any>Validators.required]],
          ReassignRequestFlag:['', [<any>Validators.required]],
          AllowReplicationFlag:['', [<any>Validators.required]],
          AllowUpdateOfServiceTypeFlag:['', [<any>Validators.required]],
          AllowUpdateOfRequestFolioFlag:['', [<any>Validators.required]],
          DisplayFlag:['', [<any>Validators.required]],
          UploadDocumentFlag:['', [<any>Validators.required]],
          ByPassClientSideValidationFlag:['', [<any>Validators.required]],
          SystemReservedFlag:[false, [<any>Validators.required]]
    });

    //this.subscribeToFormChanges();
  }

// subscribeToFormChanges(){
//   this.subscribeToBackgroundColorChanges();
//   this.subscribeTextColorChanges();
// };

// subscribeToBackgroundColorChanges() {
//     this.backgroundColorChangeSubscription = this.frmActionTypeEdit.get('BackgroundColor')
//     .valueChanges.subscribe(
//           (value) => this.onBackgroundColorChange(value),
//           (err) => console.log(err),
//           ()=> console.log('completed subscription to backgroundColorChangeSubscription')
//         );
//   }

//   subscribeTextColorChanges(){
//     this.textColorChangeSubscription = this.frmActionTypeEdit.get('TextColor')
//     .valueChanges.subscribe(
//           (value) => this.onTextColorChange(value),
//           (err) => console.log(err),
//           ()=> console.log('completed subscription to textColorChangeSubscription')
//         );
//   }

//   onBackgroundColorChange(value: string){
//     console.log(value)
//     this.frmActionTypeEdit.get('BackgroundColor').setValue(value);
//   }

//   onTextColorChange(value: string){
//     this.frmActionTypeEdit.get('TextColor').setValue(value);
//   }

//   unsubscribeFromObservables(){
//     this.backgroundColorChangeSubscription.unsubscribe();
//     this.textColorChangeSubscription.unsubscribe();
//   };

  // get currentColor(): string {
  //   return (
  //     this.frmActionTypeEdit.get('BackgroundColor').value ||
  //     null);
  // }

  // onColorPickerChange(colorCode: string): void {
  //   console.log(colorCode);
  //   this.frmActionTypeEdit.get('BackgroundColor').setValue(colorCode);
  //   // this.frmActionTypeEdit.get('BackgroundColor').markAsDirty();
  //   // this.frmActionTypeEdit.get('BackgroundColor').markAsTouched();
  // }

  getActionType(actionTypeID: number) {

    this.requestActionTypeService
    //odata parameter removes additional metadata field from being returned with model
    .getRequestActionType(actionTypeID, `/?$format=application/json;odata.metadata=none`).subscribe(
      (data: IRequestActionType) => {
        this.actionType = data;
        this.setFormValues(this.actionType);
      },
      (err) => { console.error(err) },
      () => {console.log('completed getRequestActionType subscription.') })
  }

  setFormValues(actionType : IRequestActionType){

    this.frmActionTypeEdit.patchValue({
          RequestActionTypeID: this.paramID,
          RequestActionTypeName:actionType.RequestActionTypeName,
          RequestActionTypeDescription:actionType.RequestActionTypeDescription,
          BackgroundColor:actionType.BackgroundColor,
          TextColor:actionType.TextColor,
          ChangeRequestStatusFlag:actionType.ChangeRequestStatusFlag,
          ReassignRequestFlag:actionType.ReassignRequestFlag,
          AllowReplicationFlag:actionType.AllowReplicationFlag,
          AllowUpdateOfServiceTypeFlag:actionType.AllowUpdateOfServiceTypeFlag,
          AllowUpdateOfRequestFolioFlag:actionType.AllowUpdateOfRequestFolioFlag,
          DisplayFlag:actionType.DisplayFlag,
          ByPassClientSideValidationFlag: actionType.ByPassClientSideValidationFlag,
          UploadDocumentFlag:actionType.UploadDocumentFlag,
          SystemReservedFlag: actionType.SystemReservedFlag
    })
  }

  // subscribeToFormChanges() {

  //   //subscribe to ServiceTypeIncludePropertyInfoFlag boolean value changes
  //   this.fieldTypeSubscription = this.frmServiceTypeCustomFieldEdit.get('CustomFieldTypeID').valueChanges
  //     .subscribe(value => this.onFieldTypeValueChange(value),
  //     err => this.exceptionService.catchBadResponse(err),
  //     () => console.log('completed fieldTypeSubscription subscription'));
  // }

  // unsubscribeFromObservables() {
  //   this.fieldTypeSubscription.unsubscribe();
  // }

  saveActionType(): void {

    if (this.frmActionTypeEdit.dirty && this.frmActionTypeEdit.valid) {

        this.generalService.toggleSaveButtonMode();

        let actionType : IRequestActionType = this.entityService.merge({}, this.actionType, this.frmActionTypeEdit.getRawValue());
        actionType.RequestActionTypeID === 0 ? this.createActionType(actionType) : this.updateActionType(actionType);
    }
  }

  createActionType(newActionType: IRequestActionType){

        this.requestActionTypeService.addRequestActionType(newActionType)
        .subscribe((value) => this.onSaveComplete(value, `Successfully created Action Type: ${newActionType.RequestActionTypeName}.`),
        (err) => this.generalService.toggleSaveButtonMode(),
        () => console.log(`completed addRequestActionType subscription.`)
      )
  }

  updateActionType(updatedActionType: IRequestActionType){

      this.requestActionTypeService.updateRequestActionType(updatedActionType)
      .subscribe((value) => this.onSaveComplete(value, `Successfully updated Action Type: ${updatedActionType.RequestActionTypeName}.`),
      (err) => this.generalService.toggleSaveButtonMode(),
      () => console.log(`completed updateRequestActionType subscription.`)
      )
  }

  onSaveComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      this.toastManager.success(saveMsg, 'Success!');
      //navigate to newly created actiontype
      this.route.navigate(['/ActionTypes', value]);
    }

    this.generalService.toggleSaveButtonMode();
  }

  goBack(): void {
    this.location.back();
  }

}

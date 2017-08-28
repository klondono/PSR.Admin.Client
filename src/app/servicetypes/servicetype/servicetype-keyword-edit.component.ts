import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Location } from '@angular/common';

import { ServiceTypeSearchKeywordService } from '../../api';
import { IServiceTypeSearchKeywordViewModel, ServiceTypeSearchKeywordContainerModel } from '../../models';
import { ServiceTypeEditService } from '../shared/services/servicetype-edit.service';
import { GeneralService } from '../../infrastructure';

@Component({
  selector: 'app-servicetype-keyword-edit',
  templateUrl: './servicetype-keyword-edit.component.html',
  styleUrls: ['./servicetype-keyword-edit.component.css']
})
export class ServiceTypeKeywordEditComponent implements OnInit, OnDestroy {

  private paramID: number;
  private frmServiceTypeKeywordEdit: FormGroup;
  private searchTermList: IServiceTypeSearchKeywordViewModel[];
  private deletedSearchTermIDs: number[] = [];
  private disableButton: boolean = false;
  private saveButtonText: string = 'Save';

  private get searchTermArray(): FormArray {
    return <FormArray>this.frmServiceTypeKeywordEdit.get('searchTerms');
  }

  constructor(private fb: FormBuilder,
    private location: Location,
    private generalService: GeneralService,
    private route: Router,
    private toastManager: ToastsManager,
    private serviceTypeEditService: ServiceTypeEditService,
    private serviceTypeSearchKeywordService: ServiceTypeSearchKeywordService) { }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnDestroy(){

    this.generalService.unsubscribeFromTooltipMessages();
  }

  initializeForm() {
    this.generateForm();
    this.paramID = this.serviceTypeEditService.getServiceTypeIDParam();
    this.getSearchTerms(this.paramID);
    this.generalService.subscribeToTooltipMessages();
  }

  generateForm() {
    this.frmServiceTypeKeywordEdit = this.fb.group({
      searchTerms: this.fb.array([])
    });
  }

  getSearchTerms(serviceTypeID: number) {

    let odataParams = `/?$filter=(ServiceTypeID eq ${serviceTypeID})&$select=ServiceTypeSearchKeywordLinkID,ServiceTypeSearchKeyword&$expand=ServiceTypeSearchKeyword&$format=application/json;odata.metadata=none`

    this.serviceTypeSearchKeywordService.getServiceTypeSearchKeywords(odataParams).subscribe(
      (data: IServiceTypeSearchKeywordViewModel[]) => {
        this.onSearchTermRetrieval(data);
      },
      (err) => { console.error(err) },
      () => {console.log('completed getServiceTypeSearchKeywords subscription.') })
  }

  onSearchTermRetrieval(data: IServiceTypeSearchKeywordViewModel[]): void {
    this.searchTermList = data;
    this.searchTermList.forEach(eachValue => this.searchTermArray.push(this.initSearchTerm(eachValue.ServiceTypeSearchKeyword.ServiceTypeSearchKeywordID, eachValue.ServiceTypeSearchKeyword.ServiceTypeSearchKeywordName, eachValue.ServiceTypeSearchKeywordLinkID)));

    // const newFormGroups = this.searchTermList.map(eachValue => this.initSearchTerm(eachValue.ServiceTypeSearchKeyword.ServiceTypeSearchKeywordID, eachValue.ServiceTypeSearchKeyword.ServiceTypeSearchKeywordName, eachValue.ServiceTypeSearchKeywordLinkID));
    // const newFormGroupsArray = this.fb.array(newFormGroups);
    // this.frmServiceTypeKeywordEdit.setControl('searchTerms', newFormGroupsArray);
  }

  initSearchTerm(ServiceTypeSearchKeywordID?: number, searchKeywordName?: string, searchKeywordLinkID?: number) {
    return this.fb.group({
      ServiceTypeSearchKeywordLinkID: [(searchKeywordLinkID || 0)],
      ServiceTypeSearchKeywordName: [(searchKeywordName || ''), Validators.required],
      ServiceTypeSearchKeywordID: [(ServiceTypeSearchKeywordID || 0)]
    });
  }

  addSearchTerm(): void {
    const newFormGroup = this.initSearchTerm();
    this.searchTermArray.push(newFormGroup);
    this.frmServiceTypeKeywordEdit.markAsDirty();
  }

  removeSearchTerm(i: number) {
    //find keywords / search term to be deleted by index
    const serviceTypeSearchKeywordID = this.searchTermArray.at(i).get('ServiceTypeSearchKeywordID').value;
    //add ServiceTypeSearchKeywordID to deletedSearchTermIDs array only if it is an existing key word (id is greater than zero)
    serviceTypeSearchKeywordID > 0 ? this.deletedSearchTermIDs.push(serviceTypeSearchKeywordID) : null;

    //remove related form group from form array
    this.searchTermArray.removeAt(i);
    this.frmServiceTypeKeywordEdit.markAsDirty();
  }

  saveSearchTerms() {

    if (this.frmServiceTypeKeywordEdit.valid && this.frmServiceTypeKeywordEdit.dirty) {
    this.generalService.toggleSaveButtonMode();
    let containerModel = new ServiceTypeSearchKeywordContainerModel();
    containerModel.DeletedSearchTermIDs = this.deletedSearchTermIDs;
    containerModel.ServiceTypeID = this.paramID;
    containerModel.ServiceTypeSearchKeywordUpdateModel = this.frmServiceTypeKeywordEdit.get('searchTerms').value;

    this.serviceTypeSearchKeywordService.addUpdateServiceTypeSearchKeywords(`/?$expand=ServiceTypeSearchKeyword`, containerModel)
      .subscribe((res)=> this.onSaveComplete(res, 'Updated search terms.'),
      (err)=> this.generalService.toggleSaveButtonMode(),
      ()=> console.log('completed addUpdateServiceTypeSearchKeywords subscription'))
    }
  }

  public clearArrays(){
      this.frmServiceTypeKeywordEdit.controls['searchTerms'] = this.fb.array([]);
      this.deletedSearchTermIDs = [];
  }

  onSaveComplete(value: any, saveMsg: string) {
    //if response is not false then show success message
    if (value !== false) {
      this.toastManager.success(saveMsg, 'Success!');
      this.clearArrays();
      this.onSearchTermRetrieval(value);
    }

    this.generalService.toggleSaveButtonMode();
  }

  goBack(): void {
    this.location.back();
  }
}

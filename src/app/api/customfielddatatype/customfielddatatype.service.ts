import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import { ICustomFieldDataType } from '../../models';
import { APICONFIG } from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const customFieldDataTypeURL = APICONFIG.urls.customFieldDataTypes;

@Injectable()
export class CustomFieldDataTypeService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private customFieldDataTypes: Observable<ICustomFieldDataType[]> = null;

  getCustomFieldDataTypesAndCacheResult(odataParams : string = '') {
    this.spinnerService.show();
    if (!this.customFieldDataTypes) {
        this.customFieldDataTypes = this.http.get(customFieldDataTypeURL + odataParams)
        .map(res => this.extractData<ICustomFieldDataType[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.customFieldDataTypes;
  }

  addCustomFieldDataType(customFieldDataType: ICustomFieldDataType) {
    const body = JSON.stringify(customFieldDataType);
    this.spinnerService.show();
    return <Observable<ICustomFieldDataType>>this.http
      .post(`${customFieldDataTypeURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteCustomDataFieldType(customFieldDataType: ICustomFieldDataType) {
    this.spinnerService.show();
    return <Observable<ICustomFieldDataType>>this.http
      .delete(`${customFieldDataTypeURL}/${customFieldDataType.CustomFieldDataTypeID}`)
      .map(res => this.extractData<ICustomFieldDataType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getCustomFieldDataTypes(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<ICustomFieldDataType[]>>this.http
      .get(customFieldDataTypeURL + odataParams)
      .map(res => this.extractData<ICustomFieldDataType[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getCustomFieldDataType(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<ICustomFieldDataType>>this.http
      .get(`${customFieldDataTypeURL}(${id})` + odataParams)
      .map(res => this.extractData<ICustomFieldDataType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateCustomFieldDataType(customFieldDataType: ICustomFieldDataType) {
    const body = JSON.stringify(customFieldDataType);
    this.spinnerService.show();

    return <Observable<ICustomFieldDataType>>this.http
      .put(`${customFieldDataTypeURL}/${customFieldDataType.CustomFieldDataTypeID}`, body)
      .map(res => this.extractData<ICustomFieldDataType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  private extractData<T>(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    //convert response to json
    const resJson = res.json();
    //odata collection resides in value property of response body
    //whereas other odata objects reside within the response body itself
    const body = resJson.hasOwnProperty('value') ? resJson.value : resJson;
    return <T>(body || {});
  }
}
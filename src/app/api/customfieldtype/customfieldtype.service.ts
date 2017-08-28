import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import { ICustomFieldType } from '../../models';
import { APICONFIG } from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const customFieldTypeURL = APICONFIG.urls.customFieldTypes;

@Injectable()
export class CustomFieldTypeService {

   constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private customFieldTypes: Observable<ICustomFieldType[]> = null;

  getCustomFieldTypesAndCacheResult(odataParams : string = '') {
    this.spinnerService.show();
    if (!this.customFieldTypes) {
        this.customFieldTypes = this.http.get(customFieldTypeURL + odataParams)
        .map(res => this.extractData<ICustomFieldType[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.customFieldTypes;
  }

  addCustomFieldType(customFieldType: ICustomFieldType) {
    const body = JSON.stringify(customFieldType);
    this.spinnerService.show();
    return <Observable<ICustomFieldType>>this.http
      .post(`${customFieldTypeURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteCustomFieldType(customFieldType: ICustomFieldType) {
    this.spinnerService.show();
    return <Observable<ICustomFieldType>>this.http
      .delete(`${customFieldTypeURL}/${customFieldType.CustomFieldTypeID}`)
      .map(res => this.extractData<ICustomFieldType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getCustomFieldTypes(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<ICustomFieldType[]>>this.http
      .get(customFieldTypeURL + odataParams)
      .map(res => this.extractData<ICustomFieldType[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getCustomFieldType(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<ICustomFieldType>>this.http
      .get(`${customFieldTypeURL}(${id})` + odataParams)
      .map(res => this.extractData<ICustomFieldType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateCustomFieldType(customFieldType: ICustomFieldType) {
    const body = JSON.stringify(customFieldType);
    this.spinnerService.show();

    return <Observable<ICustomFieldType>>this.http
      .put(`${customFieldTypeURL}/${customFieldType.CustomFieldTypeID}`, body)
      .map(res => this.extractData<ICustomFieldType>(res))
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
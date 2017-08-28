import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/publishreplay';

import {IServiceTypeCustomField} from '../../models';
import { APICONFIG } from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const serviceTypeCustomFieldURL = APICONFIG.urls.serviceTypeCustomFields;

@Injectable()
export class ServiceTypeCustomFieldService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private serviceTypeCustomFields: Observable<IServiceTypeCustomField[]> = null;

  getServiceTypeCustomFieldsAndCacheResult(odataParams : string = ''): Observable<IServiceTypeCustomField[]> {
    this.spinnerService.show();
    if (!this.serviceTypeCustomFields) {
        this.serviceTypeCustomFields = this.http.get(serviceTypeCustomFieldURL + odataParams)
        .map(res => this.extractData<IServiceTypeCustomField[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.serviceTypeCustomFields;
  }

  getServiceTypeCustomFields(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeCustomField[]>>this.http
      .get(serviceTypeCustomFieldURL + odataParams)
      .map(res => this.extractData<IServiceTypeCustomField[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  addServiceTypeCustomField(serviceTypeCustomField: IServiceTypeCustomField) {
    const body = JSON.stringify(serviceTypeCustomField);
    this.spinnerService.show();
    return <Observable<IServiceTypeCustomField>>this.http
      .post(`${serviceTypeCustomFieldURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteServiceTypeCustomField(serviceTypeCustomFieldID: number) {
    this.spinnerService.show();
    return <Observable<any>>this.http
      .delete(`${serviceTypeCustomFieldURL}(${serviceTypeCustomFieldID})`)
      .map(res => this.extractData<any>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getServiceTypeCustomField(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeCustomField>>this.http
      .get(`${serviceTypeCustomFieldURL}(${id})` + odataParams)
      .map(res => this.extractData<IServiceTypeCustomField>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateServiceTypeCustomField(serviceTypeCustomField: IServiceTypeCustomField) {
    const body = JSON.stringify(serviceTypeCustomField);
    this.spinnerService.show();

    return <Observable<IServiceTypeCustomField>>this.http
      .patch(`${serviceTypeCustomFieldURL}(${serviceTypeCustomField.ServiceTypeCustomFieldID})`, body)
      .map(res => this.extractData<IServiceTypeCustomField>(res))
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


import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/publishreplay';

import { IRequestActionTypeCustomField } from '../../models';
import { APICONFIG } from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const actionTypeCustomFieldURL = APICONFIG.urls.requestActionTypeCustomFields;

@Injectable()
export class RequestActionTypeCustomFieldService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private actionTypeCustomFields: Observable<IRequestActionTypeCustomField[]> = null;

  getActionTypeCustomFieldsAndCacheResult(odataParams : string = ''): Observable<IRequestActionTypeCustomField[]> {
    this.spinnerService.show();
    if (!this.actionTypeCustomFields) {
        this.actionTypeCustomFields = this.http.get(actionTypeCustomFieldURL + odataParams)
        .map(res => this.extractData<IRequestActionTypeCustomField[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.actionTypeCustomFields;
  }

  getActionTypeCustomFields(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IRequestActionTypeCustomField[]>>this.http
      .get(actionTypeCustomFieldURL + odataParams)
      .map(res => this.extractData<IRequestActionTypeCustomField[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  addActionTypeCustomField(actionTypeCustomField: IRequestActionTypeCustomField) {
    const body = JSON.stringify(actionTypeCustomField);
    this.spinnerService.show();
    return <Observable<IRequestActionTypeCustomField>>this.http
      .post(`${actionTypeCustomFieldURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteActionTypeCustomField(actionTypeCustomFieldID: number) {
    this.spinnerService.show();
    return <Observable<any>>this.http
      .delete(`${actionTypeCustomFieldURL}(${actionTypeCustomFieldID})`)
      .map(res => this.extractData<any>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getActionTypeCustomField(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IRequestActionTypeCustomField>>this.http
      .get(`${actionTypeCustomFieldURL}(${id})` + odataParams)
      .map(res => this.extractData<IRequestActionTypeCustomField>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateActionTypeCustomField(actionTypeCustomField: IRequestActionTypeCustomField) {
    const body = JSON.stringify(actionTypeCustomField);
    this.spinnerService.show();

    return <Observable<IRequestActionTypeCustomField>>this.http
      .patch(`${actionTypeCustomFieldURL}(${actionTypeCustomField.RequestActionTypeCustomFieldID})`, body)
      .map(res => this.extractData<IRequestActionTypeCustomField>(res))
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


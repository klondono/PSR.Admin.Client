import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/publishreplay';

import {IRequestActionType} from '../../models';
import { APICONFIG } from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const requestActionTypeURL = APICONFIG.urls.requestActionTypes;

@Injectable()
export class RequestActionTypeService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private requestActionTypes: Observable<IRequestActionType[]> = null;

  getRequestActionTypesAndCacheResult(odataParams : string = ''): Observable<IRequestActionType[]> {
    this.spinnerService.show();
    if (!this.requestActionTypes) {
        this.requestActionTypes = this.http.get(requestActionTypeURL + odataParams)
        .map(res => this.extractData<IRequestActionType[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.requestActionTypes;
  }

  getRequestActionTypes(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IRequestActionType[]>>this.http
      .get(requestActionTypeURL + odataParams)
      .map(res => this.extractData<IRequestActionType[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  addRequestActionType(requestActionType: IRequestActionType) {
    const body = JSON.stringify(requestActionType);
    this.spinnerService.show();
    return <Observable<IRequestActionType>>this.http
      .post(`${requestActionTypeURL}`, body)
      .map(res => this.extractData<any>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteRequestActionType(requestActionType: IRequestActionType) {
    this.spinnerService.show();
    return <Observable<IRequestActionType>>this.http
      .delete(`${requestActionTypeURL}(${requestActionType.RequestActionTypeID})`)
      .map(res => this.extractData<IRequestActionType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getRequestActionType(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IRequestActionType>>this.http
      .get(`${requestActionTypeURL}(${id})` + odataParams)
      .map(res => this.extractData<IRequestActionType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateRequestActionType(requestActionType: IRequestActionType) {
    const body = JSON.stringify(requestActionType);
    this.spinnerService.show();

    return <Observable<IRequestActionType>>this.http
      .patch(`${requestActionTypeURL}(${requestActionType.RequestActionTypeID})`, body)
      .map(res => this.extractData<IRequestActionType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  private extractData<T>(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    //convert response to json
    const resJson = res.json();
    console.log(resJson)
    //odata collection resides in value property of response body
    //whereas other odata objects reside within the response body itself
    const body = resJson.hasOwnProperty('value') ? resJson.value : resJson;
    return <T>(body || {});
  }
}
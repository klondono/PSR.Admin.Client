import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import {IRequestStatus} from '../../models';
import {APICONFIG} from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const requestStatusURL = APICONFIG.urls.requestStatuses;

@Injectable()
export class RequestStatusService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private requestStatuses: Observable<IRequestStatus[]> = null;

  getRequestStatusesAndCacheResult(odataParams : string = '') {
    this.spinnerService.show();
    if (!this.requestStatuses) {
        this.requestStatuses = this.http.get(requestStatusURL + odataParams)
        .map(res => this.extractData<IRequestStatus[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.requestStatuses;
  }

  addRequestStatus(requestStatus: IRequestStatus) {
    const body = JSON.stringify(requestStatus);
    this.spinnerService.show();
    return <Observable<IRequestStatus>>this.http
      .post(`${requestStatusURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteRequestStatus(requestStatus: IRequestStatus) {
    this.spinnerService.show();
    return <Observable<IRequestStatus>>this.http
      .delete(`${requestStatusURL}/${requestStatus.RequestStatusID}`)
      .map(res => this.extractData<IRequestStatus>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getRequestStatuses(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IRequestStatus[]>>this.http
      .get(requestStatusURL + odataParams)
      .map(res => this.extractData<IRequestStatus[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getRequestStatus(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IRequestStatus>>this.http
      .get(`${requestStatusURL}(${id})` + odataParams)
      .map(res => this.extractData<IRequestStatus>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateRequestStatus(requestStatus: IRequestStatus) {
    const body = JSON.stringify(requestStatus);
    this.spinnerService.show();

    return <Observable<IRequestStatus>>this.http
      .put(`${requestStatusURL}/${requestStatus.RequestStatusID}`, body)
      .map(res => this.extractData<IRequestStatus>(res))
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

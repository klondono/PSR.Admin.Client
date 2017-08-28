import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import {IRequestOrigin} from '../../models';
import {APICONFIG} from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const requestOriginURL = APICONFIG.urls.requestOrigins;

@Injectable()
export class RequestOriginService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private requestOrigins: Observable<IRequestOrigin[]> = null;

  getRequestOriginsAndCacheResult(odataParams : string = '') {
    this.spinnerService.show();
    if (!this.requestOrigins) {
        this.requestOrigins = this.http.get(requestOriginURL + odataParams)
        .map(res => this.extractData<IRequestOrigin[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.requestOrigins;
  }

  addRequestOrigin(requestOrigin: IRequestOrigin) {
    const body = JSON.stringify(requestOrigin);
    this.spinnerService.show();
    return <Observable<IRequestOrigin>>this.http
      .post(`${requestOriginURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteRequestOrigin(requestOrigin: IRequestOrigin) {
    this.spinnerService.show();
    return <Observable<IRequestOrigin>>this.http
      .delete(`${requestOriginURL}/${requestOrigin.RequestOriginID}`)
      .map(res => this.extractData<IRequestOrigin>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getRequestOrigins(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IRequestOrigin[]>>this.http
      .get(requestOriginURL + odataParams)
      .map(res => this.extractData<IRequestOrigin[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getRequestOrigin(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IRequestOrigin>>this.http
      .get(`${requestOriginURL}(${id})` + odataParams)
      .map(res => this.extractData<IRequestOrigin>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateRequestOrigin(requestOrigin: IRequestOrigin) {
    const body = JSON.stringify(requestOrigin);
    this.spinnerService.show();

    return <Observable<IRequestOrigin>>this.http
      .put(`${requestOriginURL}/${requestOrigin.RequestOriginID}`, body)
      .map(res => this.extractData<IRequestOrigin>(res))
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


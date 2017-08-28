import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/publishreplay';

import {IServiceType} from '../../models';
import {APICONFIG} from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const serviceTypeURL = APICONFIG.urls.serviceTypes;

@Injectable()
export class ServiceTypeService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private serviceTypes: Observable<IServiceType[]> = null;

  getServiceTypesAndCacheResult(odataParams : string = '') {
    this.spinnerService.show();
    if (!this.serviceTypes) {
        this.serviceTypes = this.http.get(serviceTypeURL + odataParams)
        .map(res => this.extractData<IServiceType[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.serviceTypes;
  }

  getServiceTypes(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceType[]>>this.http
      .get(serviceTypeURL + odataParams)
      .map(res => this.extractData<IServiceType[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  addServiceType(serviceType: IServiceType) {
    const body = JSON.stringify(serviceType);
    this.spinnerService.show();
    return <Observable<any>>this.http
      .post(`${serviceTypeURL}`, body)
      .map(res => this.extractData<any>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateServiceType(serviceType: IServiceType) {
    const body = JSON.stringify(serviceType);
    this.spinnerService.show();
    return <Observable<any>>this.http
      .patch(`${serviceTypeURL}(${serviceType.ServiceTypeID})`, body)
      .map(res => this.extractData<any>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteServiceType(serviceType: IServiceType) {
    this.spinnerService.show();
    return <Observable<IServiceType>>this.http
      .delete(`${serviceTypeURL}(${serviceType.ServiceTypeID})`)
      .map(res => this.extractData<IServiceType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getServiceType(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceType>>this.http
      .get(`${serviceTypeURL}(${id})` + odataParams)
      .map(res => this.extractData<IServiceType>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  cloneServiceType(id: number, odataParams : string = '') {
  this.spinnerService.show();
  return <Observable<any>>this.http
    .post(`${serviceTypeURL}/PSR.Clone` + odataParams, {serviceTypeID: id})
    .map(res => this.extractData<any>(res))
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

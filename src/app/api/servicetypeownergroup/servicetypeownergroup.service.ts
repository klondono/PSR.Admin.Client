import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import {IServiceTypeOwnerGroup} from '../../models';
import {APICONFIG} from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const serviceTypeOwnerGroupURL = APICONFIG.urls.serviceTypeOwnerGroups;

@Injectable()
export class ServiceTypeOwnerGroupService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private serviceTypeOwnerGroups: Observable<IServiceTypeOwnerGroup[]> = null;

  getServiceTypeOwnerGroupsAndCacheResult(odataParams : string = '') {
    this.spinnerService.show();
    if (!this.serviceTypeOwnerGroups) {
        this.serviceTypeOwnerGroups = this.http.get(serviceTypeOwnerGroupURL + odataParams)
        .map(res => this.extractData<IServiceTypeOwnerGroup[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.serviceTypeOwnerGroups;
  }

  addServiceTypeOwnerGroup(serviceTypeOwnerGroup: IServiceTypeOwnerGroup) {
    const body = JSON.stringify(serviceTypeOwnerGroup);
    this.spinnerService.show();
    return <Observable<IServiceTypeOwnerGroup>>this.http
      .post(`${serviceTypeOwnerGroupURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteServiceTypeOwnerGroup(serviceTypeOwnerGroup: IServiceTypeOwnerGroup) {
    this.spinnerService.show();
    return <Observable<IServiceTypeOwnerGroup>>this.http
      .delete(`${serviceTypeOwnerGroupURL}/${serviceTypeOwnerGroup.ServiceTypeOwnerGroupID}`)
      .map(res => this.extractData<IServiceTypeOwnerGroup>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getServiceTypeOwnerGroups(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeOwnerGroup[]>>this.http
      .get(serviceTypeOwnerGroupURL + odataParams)
      .map(res => this.extractData<IServiceTypeOwnerGroup[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getServiceTypeOwnerGroup(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeOwnerGroup>>this.http
      .get(`${serviceTypeOwnerGroupURL}(${id})` + odataParams)
      .map(res => this.extractData<IServiceTypeOwnerGroup>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateServiceTypeOwnerGroup(serviceTypeOwnerGroup: IServiceTypeOwnerGroup) {
    const body = JSON.stringify(serviceTypeOwnerGroup);
    this.spinnerService.show();

    return <Observable<IServiceTypeOwnerGroup>>this.http
      .put(`${serviceTypeOwnerGroupURL}/${serviceTypeOwnerGroup.ServiceTypeOwnerGroupID}`, body)
      .map(res => this.extractData<IServiceTypeOwnerGroup>(res))
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

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/publishreplay';

import { IServiceTypeRequestActionTypeLink, ServiceTypeActionTypeLinkContainerModel } from '../../models';
import { APICONFIG } from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const serviceTypeRequestActionTypeLinkURL = APICONFIG.urls.serviceTypeRequestActionTypeLinks;

@Injectable()
export class ServiceTypeRequestActionTypeLinkService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private servicetypeRequestActionTypeLinks: Observable<IServiceTypeRequestActionTypeLink[]> = null;

  getServiceTypeRequestActionTypeLinksAndCacheResult(odataParams : string = ''): Observable<IServiceTypeRequestActionTypeLink[]> {
    this.spinnerService.show();
    if (!this.servicetypeRequestActionTypeLinks) {
        this.servicetypeRequestActionTypeLinks = this.http.get(serviceTypeRequestActionTypeLinkURL + odataParams)
        .map(res => this.extractData<IServiceTypeRequestActionTypeLink[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.servicetypeRequestActionTypeLinks;
  }

  getServiceTypeRequestActionTypeLinks(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeRequestActionTypeLink[]>>this.http
      .get(serviceTypeRequestActionTypeLinkURL + odataParams)
      .map(res => this.extractData<IServiceTypeRequestActionTypeLink[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  addServiceTypeRequestActionTypeLink(servicetypeRequestActionTypeLinks: IServiceTypeRequestActionTypeLink) {
    const body = JSON.stringify(servicetypeRequestActionTypeLinks);
    this.spinnerService.show();
    return <Observable<IServiceTypeRequestActionTypeLink>>this.http
      .post(`${serviceTypeRequestActionTypeLinkURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  addUpdateServiceTypeRequestActionTypeLinks(odataParams: string, paramValue: ServiceTypeActionTypeLinkContainerModel) {
    return <Observable<IServiceTypeRequestActionTypeLink>>this.http
      .post(`${serviceTypeRequestActionTypeLinkURL}/PSR.AddOrUpdate${odataParams}`, {serviceTypeActionTypeLinkContainerModel:paramValue})
      .map(res => this.extractData<IServiceTypeRequestActionTypeLink>(res))
      .catch(this.exceptionService.catchBadResponse);
  }

  deleteServiceTypeRequestActionTypeLink(servicetypeRequestActionTypeLinks: IServiceTypeRequestActionTypeLink) {
    this.spinnerService.show();
    return <Observable<IServiceTypeRequestActionTypeLink>>this.http
      .delete(`${serviceTypeRequestActionTypeLinkURL}/${servicetypeRequestActionTypeLinks.ServiceTypeRequestActionTypeLinkID}`)
      .map(res => this.extractData<IServiceTypeRequestActionTypeLink>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getServiceTypeRequestActionTypeLink(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeRequestActionTypeLink>>this.http
      .get(`${serviceTypeRequestActionTypeLinkURL}(${id})` + odataParams)
      .map(res => this.extractData<IServiceTypeRequestActionTypeLink>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateServiceTypeRequestActionTypeLink(servicetypeRequestActionTypeLinks: IServiceTypeRequestActionTypeLink) {
    const body = JSON.stringify(servicetypeRequestActionTypeLinks);
    this.spinnerService.show();

    return <Observable<IServiceTypeRequestActionTypeLink>>this.http
      .put(`${serviceTypeRequestActionTypeLinkURL}/${servicetypeRequestActionTypeLinks.ServiceTypeRequestActionTypeLinkID}`, body)
      .map(res => this.extractData<IServiceTypeRequestActionTypeLink>(res))
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
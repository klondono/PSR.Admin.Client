import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

import {IServiceTypeSearchKeyword, IServiceTypeSearchKeywordViewModel, ServiceTypeSearchKeywordContainerModel} from '../../models';
import {APICONFIG} from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const serviceTypeSearchKeywordURL = APICONFIG.urls.serviceTypeSearchKeywords;
const serviceTypeSearchKeywordLinkURL = APICONFIG.urls.serviceTypeSearchKeywordLinks;

@Injectable()
export class ServiceTypeSearchKeywordService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private serviceTypeSearchKeywords: Observable<IServiceTypeSearchKeyword[]> = null;

  getServiceTypeSearchKeywordsAndCacheResult(odataParams : string = '') {
    this.spinnerService.show();
    if (!this.serviceTypeSearchKeywords) {
        this.serviceTypeSearchKeywords = this.http.get(serviceTypeSearchKeywordURL + odataParams)
        .map(res => this.extractData<IServiceTypeSearchKeyword[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.serviceTypeSearchKeywords;
  }

  addServiceTypeSearchKeyword(serviceTypeSearchKeyword: IServiceTypeSearchKeyword) {
    const body = JSON.stringify(serviceTypeSearchKeyword);
    this.spinnerService.show();
    return <Observable<IServiceTypeSearchKeyword>>this.http
      .post(`${serviceTypeSearchKeywordURL}`, body)
      .map(res => res.json().data)
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  addUpdateServiceTypeSearchKeywords(odataParams: string, paramValue: ServiceTypeSearchKeywordContainerModel) {
    return <Observable<IServiceTypeSearchKeyword>>this.http
      .post(`${serviceTypeSearchKeywordURL}/PSR.AddOrUpdate${odataParams}`, {serviceTypeSearchKeywordContainerModel:paramValue})
      .map(res => this.extractData<IServiceTypeSearchKeyword[]>(res))
      .catch(this.exceptionService.catchBadResponse);
  }

  deleteServiceTypeSearchKeyword(serviceTypeSearchKeyword: IServiceTypeSearchKeyword) {
    this.spinnerService.show();
    return <Observable<IServiceTypeSearchKeyword>>this.http
      .delete(`${serviceTypeSearchKeywordURL}/${serviceTypeSearchKeyword.ServiceTypeSearchKeywordID}`)
      .map(res => this.extractData<IServiceTypeSearchKeyword>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getServiceTypeSearchKeywords(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeSearchKeywordViewModel[]>>this.http
      .get(serviceTypeSearchKeywordLinkURL + odataParams)
      .map(res => this.extractData<IServiceTypeSearchKeywordViewModel[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  getServiceTypeSearchKeyword(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeSearchKeyword>>this.http
      .get(`${serviceTypeSearchKeywordURL}(${id})` + odataParams)
      .map(res => this.extractData<IServiceTypeSearchKeyword>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateServiceTypeSearchKeyword(serviceTypeSearchKeyword: IServiceTypeSearchKeyword) {
    const body = JSON.stringify(serviceTypeSearchKeyword);
    this.spinnerService.show();

    return <Observable<IServiceTypeSearchKeyword>>this.http
      .put(`${serviceTypeSearchKeywordURL}/${serviceTypeSearchKeyword.ServiceTypeSearchKeywordID}`, body)
      .map(res => this.extractData<IServiceTypeSearchKeyword>(res))
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


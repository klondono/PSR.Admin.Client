import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/publishreplay';

import {IServiceTypeRelationshipDefinition, ServiceTypeRelationshipDefinitionDeletionModel} from '../../models';
import { APICONFIG } from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const serviceTypeRelationshipDefinitionURL = APICONFIG.urls.serviceTypeRelationshipDefinitions;

@Injectable()
export class ServiceTypeRelationshipDefinitionService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  private serviceTypeRelationshipDefinitions: Observable<IServiceTypeRelationshipDefinition[]> = null;
  private serviceTypeIsParent:  Observable<Boolean> = null;

  getServiceTypeRelationshipDefinitionsAndCacheResult(odataParams : string = '') {
    this.spinnerService.show();
    if (!this.serviceTypeRelationshipDefinitions) {
        this.serviceTypeRelationshipDefinitions = this.http.get(serviceTypeRelationshipDefinitionURL + odataParams)
        .map(res => this.extractData<IServiceTypeRelationshipDefinition[]>(res))
        //cache the most recent value
        .publishReplay(1)
        //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
      }
      return this.serviceTypeRelationshipDefinitions;
  }

  hasDependantServiceTypesAndCacheResult(serviceTypeID : number) {
    this.spinnerService.show();
    if (!this.serviceTypeIsParent) {
      return <Observable<Boolean>>this.http
        .get(`${serviceTypeRelationshipDefinitionURL}/$count/?$filter=(ServiceTypeParentID eq ${serviceTypeID})`)
        .map(res => this.extractData<Number>(res) >= 1)
        //cache the most recent value
        .publishReplay(1)
          //keep the observable alive for as long as there are subscribers
        .refCount()
        .catch(this.exceptionService.catchBadResponse)
        .finally(() => this.spinnerService.hide());
    }
    return this.serviceTypeIsParent;
  }

  getServiceTypeRelationshipDefinitions(odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeRelationshipDefinition[]>>this.http
      .get(serviceTypeRelationshipDefinitionURL + odataParams)
      .map(res => this.extractData<IServiceTypeRelationshipDefinition[]>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  addServiceTypeRelationshipDefinition(serviceTypeRelationshipDefinition: IServiceTypeRelationshipDefinition, odataParams: string) {
    const body = JSON.stringify(serviceTypeRelationshipDefinition);
    this.spinnerService.show();
    return <Observable<IServiceTypeRelationshipDefinition>>this.http
      .post(`${serviceTypeRelationshipDefinitionURL}${odataParams}`, body)
      .map(res => this.extractData<any>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  deleteServiceTypeRelationshipDefinition(paramValue: ServiceTypeRelationshipDefinitionDeletionModel) {
    return <Observable<any>>this.http
      .post(`${serviceTypeRelationshipDefinitionURL}/PSR.DeleteRelationship`, {serviceTypeRelationshipDefinitionDeletionModel:paramValue})
      .map(res => this.extractData<any[]>(res))
      .catch(this.exceptionService.catchBadResponse);
  }

  getServiceTypeRelationshipDefinition(id: number, odataParams : string = '') {
    this.spinnerService.show();
    return <Observable<IServiceTypeRelationshipDefinition>>this.http
      .get(`${serviceTypeRelationshipDefinitionURL}(${id})` + odataParams)
      .map(res => this.extractData<IServiceTypeRelationshipDefinition>(res))
      .catch(this.exceptionService.catchBadResponse)
      .finally(() => this.spinnerService.hide());
  }

  updateServiceTypeRelationshipDefinition(serviceTypeRelationshipDefinition: IServiceTypeRelationshipDefinition) {
    const body = JSON.stringify(serviceTypeRelationshipDefinition);
    this.spinnerService.show();

    return <Observable<IServiceTypeRelationshipDefinition>>this.http
      .patch(`${serviceTypeRelationshipDefinitionURL}(${serviceTypeRelationshipDefinition.ServiceTypeRelationshipDefinitionID})`, body)
      .map(res => this.extractData<IServiceTypeRelationshipDefinition>(res))
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

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/publishreplay';

import {IDbObject} from '../../models';
import { APICONFIG } from '../config/api.config'
import { SpinnerService, ExceptionService } from '../../infrastructure';

//declare const for base url
const dbObjectURL = APICONFIG.urls.dbObjects;

@Injectable()
export class DbObjectService {

  constructor(private http: Http,
    private exceptionService: ExceptionService,
    private spinnerService: SpinnerService) {
  }

  getDbObjects(odataParams : string = '') {
    return <Observable<IDbObject[]>>this.http
      .get(dbObjectURL + odataParams)
      .map(res => this.extractData<IDbObject[]>(res))
      .catch(this.exceptionService.catchBadResponse);
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

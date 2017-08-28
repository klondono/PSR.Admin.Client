import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { PACONFIG } from '../../config/pa.common.config'

export interface ICurrentUser {
    Id: number;
    DisplayName: string;
}

@Injectable()
export class UserService {

  constructor(private _http: Http) { }

  getCurrentUser(): Observable<ICurrentUser> {
    return this._http.get(PACONFIG.Urls.getUserName)
      .map((response: Response) => <ICurrentUser>response.json())
      .do(data => console.log('getCurrentUser: ' + JSON.stringify(data)))
      .catch(error => this.handleError(error, 'UserService ', 'Error with retrieving username'))
  }

  private handleError(error: Response, serviceName: string, customStatusText: string) {
    error.statusText = customStatusText;
    console.error(serviceName + error);
    return Observable.throw(error);
  }
}

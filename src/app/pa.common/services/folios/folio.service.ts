import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { PACONFIG } from '../../config/pa.common.config'

export interface IFolioExists {
    value: boolean
}
@Injectable()
export class FolioService {

  constructor(private _http: Http) { }

  folioExists(folio : string): Observable<IFolioExists> {
    return this._http.get(`${PACONFIG.Urls.folioExists}(folio='${folio}')`)
      .map((response: Response) => <IFolioExists>response.json())
      .do(data => console.log('Folio Validity: ' + JSON.stringify(data)))
      .catch(error => this.handleError(error, 'FolioService ', `Error validating whether folio ${folio} exists.`))
  }

  private handleError(error: Response, serviceName: string, customStatusText: string) {
    error.statusText = customStatusText;
    console.error(serviceName + error);
    return Observable.throw(error);
  }
}

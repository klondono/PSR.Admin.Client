import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/observable/of';



@Injectable()
export class ExceptionService {
  constructor(private toastService: ToastsManager) { console.log('created exception service')}

  catchBadResponse: (errorResponse: any) => Observable<any> = (errorResponse: any) => {
    const res = <Response>errorResponse;
    const err = JSON.parse(JSON.stringify(res || null ))
    const emsg = err ?
      (err._body ? err._body : res.statusText) :
      (JSON.stringify(err) || 'unknown error');
    console.log(emsg);
    this.toastService.error(emsg,`Error`, {dismiss : 'click'});
    // return Observable.throw(emsg); // TODO: We should NOT swallow error here.
    return Observable.of(false);
  }
}
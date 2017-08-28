import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface ToastMessage {
  title: string,
  message:string,
  color:string
}

@Injectable()
export class ToastService {

private toastSubject = new Subject<ToastMessage>();
toastState = this.toastSubject.asObservable();

    constructor(@Optional() @SkipSelf() prior: ToastService) {
    if (prior) {
      console.log('toast service already exists');
      return prior;
    } else {
      console.log('created toast service')
    }
  }

    activate(message?: string, title?: string, color?:string) {
      this.toastSubject.next(<ToastMessage>{ message: message, title: title, color: color  });
  }

    activateSuccess(message?: string, title?: string, color?:string) {
     this.activate(message, title, "#51a351");
  }

    activateWarning(message?: string, title?: string, color?:string) {
     this.activate(message, title, "#f89406");
  }

    activateInfo(message?: string, title?: string, color?:string) {
     this.activate(message, title, "#2f96b4");
  }

    activateError(message?: string, title?: string, color?:string) {
     this.activate(message, title, "#bd362f");
  }
}

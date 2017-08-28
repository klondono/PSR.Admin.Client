import {ToastOptions} from 'ng2-toastr/ng2-toastr';

export class CustomToastOption extends ToastOptions {
  animate = 'flyRight';
  newestOnTop = false;
  showCloseButton = true;
  positionClass: 'toast-bottom-full-width';
  dismiss: "click";
  toastLife: 5000;
}
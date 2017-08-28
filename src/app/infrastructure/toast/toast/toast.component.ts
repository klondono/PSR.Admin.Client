import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../toastservice/toast.service';

import { Subscription } from 'rxjs/Subscription'

@Component({
  moduleId: module.id,
  selector: 'app-toast',
  templateUrl: 'toast.component.html',
  styleUrls: ['toast.component.css']
})
export class ToastComponent implements OnDestroy, OnInit {
  private defaults = {
    title: '',
    message: '',
    color: '#0088cc'
  };
  private toastElement: any;
  private toastSubscription: Subscription;

  title: string;
  message: string;
  color: string

  constructor(private toastService: ToastService) {
    this.toastSubscription = this.toastService.toastState.subscribe((toastMessage) => {
      console.log(`activiting toast: ${toastMessage.message}`)
      this.activate(toastMessage.message, toastMessage.title, toastMessage.color);
    });
  }

  activate(message = this.defaults.message, title = this.defaults.title, color = this.defaults.color) {
    this.title = title;
    this.message = message;
    this.color = color;
    this.show();
  }

  ngOnInit() {
    this.toastElement = document.getElementById('toast');
  }

  ngOnDestroy() {
    this.toastSubscription.unsubscribe();
  }

  private show() {
    console.log(this.message);
    this.toastElement.style.opacity = 1;
    this.toastElement.style.zIndex = 9999;

    window.setTimeout(() => this.hide(), 2500);
  }

  private hide() {
    this.toastElement.style.opacity = 0;
    window.setTimeout(() => this.toastElement.style.zIndex = 0, 400);
  }
}


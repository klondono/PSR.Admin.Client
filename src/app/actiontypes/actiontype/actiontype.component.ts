import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ActionTypeEditService, ActionTypePanelHeaderInfo } from '../shared/services//actiontype-edit.service';

@Component({
  selector: 'app-action-type',
  templateUrl: './actiontype.component.html',
  styleUrls: ['./actiontype.component.css']
})
export class ActionTypeComponent implements OnInit {

  private routerEventSubscription : Subscription;
  private paramIDSubscription : Subscription;
  private currentRouteName: string;
  private panelHeaderInfo: ActionTypePanelHeaderInfo;
  private isGeneral : boolean = true;
  private isCustomFields: boolean = false;
  private paramID: number;
  private disableTab: boolean = false;

  constructor(private router: Router,
  private activatedRoute: ActivatedRoute,
  private actionTypeEditService: ActionTypeEditService) {}

  ngOnInit() {
    this.subscribeToRouterParams();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy() {
    this.unsubscribeFromObservables();
  }

  getPanelHeaderInfo(actionTypeID : number){
    this.panelHeaderInfo = this.actionTypeEditService.getPanelInfo(actionTypeID);
  }

  subscribeToRouterParams() {
    this.paramIDSubscription =
      this.activatedRoute.params.subscribe((params: Params) => {
        this.paramID = +params['id'];
        this.disableTab = this.paramID === 0;
        this.actionTypeEditService.setActionTypeIDParam(this.paramID);
        this.getPanelHeaderInfo(this.paramID);
      })
  }

  subscribeToRouterEvents(){

    this.routerEventSubscription = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRouteName = event.url.substr(event.url.lastIndexOf('/') + 1);
          //get routenames to activate appropriate tab
          //the Edit route needs to be evaluated for route name or whether the route name is a number
          //because the router redirects to Edit when only the servicetypeid is in the url
          this.isGeneral = (this.currentRouteName == 'Edit' || new RegExp('^\\d+$').test(this.currentRouteName));
          this.isCustomFields = this.currentRouteName == 'CustomFields';
        }
      });
  }

  unsubscribeFromObservables() {
    this.routerEventSubscription.unsubscribe();
    this.paramIDSubscription.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { ServiceTypeEditService, PanelHeaderInfo } from '../shared/services//servicetype-edit.service';
import { ServiceTypeService} from '../../api';
import { ModalService } from '../../infrastructure';

@Component({
  selector: 'app-servicetype',
  templateUrl: './servicetype.component.html',
  styleUrls: ['./servicetype.component.css']
})
export class ServiceTypeComponent implements OnInit, OnDestroy {

  private routerEventSubscription : Subscription;
  private paramIDSubscription : Subscription;
  private currentRouteName: string;
  private panelHeaderInfo: PanelHeaderInfo;
  private isGeneral : boolean = true;
  private isKeywords: boolean = false;
  private isActionTypes: boolean = false;
  private isCustomFields: boolean = false;
  private paramID: number;
  private disableTab: boolean = false;

  constructor(private router: Router,
  private modalService: ModalService,
  private toastManager: ToastsManager,
  private serviceTypeService: ServiceTypeService,
  private activatedRoute: ActivatedRoute,
  private serviceTypeEditService: ServiceTypeEditService) {}

  ngOnInit() {
    this.subscribeToRouterParams();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy() {
    this.unsubscribeFromObservables();
  }

  getPanelHeaderInfo(serviceTypeID : number){
    this.panelHeaderInfo = this.serviceTypeEditService.getPanelInfo(serviceTypeID);
  }

  subscribeToRouterParams() {
    this.paramIDSubscription =
      this.activatedRoute.params.subscribe((params: Params) => {
        this.paramID = +params['id'];
        this.disableTab = this.paramID === 0;
        this.serviceTypeEditService.setServiceTypeIDParam(this.paramID);
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
          this.isGeneral = (this.currentRouteName == 'Edit' || new RegExp('^\\d+$').test(this.currentRouteName)) ;
          this.isKeywords = this.currentRouteName == 'Keywords';
          this.isActionTypes = this.currentRouteName == 'ActionTypes';
          this.isCustomFields = this.currentRouteName == 'CustomFields';
        }
      });
  }

  cloneServiceType(){
    this.showConfirmCloneModal(`Are you sure you want to clone this service type along with all associated action types and custom fields?
    (Please note that search tags will not be copied)`, 'Clone Service Type');
  }

  showConfirmCloneModal(message: string, title: string) {
    this.modalService.activate(message, title, 'Yes', 'Cancel').then(responseOK => {
      if (responseOK) {
          this.cloneConfirmed();
      }
    });
  }

  cloneConfirmed(){
    this.serviceTypeService.cloneServiceType(this.paramID).
    subscribe((newId: number) =>
      this.onCloneComplete(newId),
    (err)=> console.log(err),
    ()=> console.log(`completed cloneServiceType subscription.`)
    )
  }

  onCloneComplete(value: any) {
    if (value !== false) {
      this.toastManager.success('Successfully cloned service type.', 'Success!');
      //navigate to newly cloned servicetype
      this.router.navigateByUrl(`/ServiceTypes/${value}/Edit`);
    }
  }

  unsubscribeFromObservables() {
    this.routerEventSubscription.unsubscribe();
    this.paramIDSubscription.unsubscribe();
  }
}

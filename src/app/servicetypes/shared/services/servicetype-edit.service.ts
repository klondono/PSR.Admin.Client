import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
// import { Subscription } from 'rxjs/Subscription'

import { ServiceTypeService } from '../../../api';
import { IServiceType } from '../../../models';

export class PanelHeaderInfo {
  panelTitle : string;
}

@Injectable()
export class ServiceTypeEditService {

  private panelHeaderInfo: PanelHeaderInfo = null;
  public serviceTypeIDParam: number = null;
  private refreshEditServiceType$ = new Subject<boolean>();
  // Observable string sources
  //private panelTitleSource$ = new Subject<PanelHeaderInfo>();
  //private serviceTypeParamSource$ = new Subject<PanelHeaderInfo>();

  constructor(private serviceTypeService : ServiceTypeService) {}

  // Observable string streams
  //panelTitle$ = this.panelTitleSource$.asObservable();

  // Service message commands
  // getPanelHeaderInfo(){
  //   return this.panelTitleSource$;
  // }

  // updatePanelHeaderInfo(panelHeaderInfo: PanelHeaderInfo) {
  //     this.panelTitleSource$.next(panelHeaderInfo);
  // }

  onServiceTypeClone(){
      return this.refreshEditServiceType$;
  }

  triggerServiceTypeEditRefresh() {
      this.refreshEditServiceType$.next(true);
  }

  getPanelInfo(serviceTypeID: number) : PanelHeaderInfo {
    //call web service to update panelheader info
    this.updatePanelInfo(serviceTypeID);
    return this.panelHeaderInfo;
  }

  setServiceTypeIDParam(serviceTypeID : number){
    this.serviceTypeIDParam = serviceTypeID;
  }

  getServiceTypeIDParam(): number{
    return this.serviceTypeIDParam;
  }

  private updatePanelInfo(serviceTypeID: number) {
      this.panelHeaderInfo = new PanelHeaderInfo();
      if(serviceTypeID === 0){
          this.panelHeaderInfo.panelTitle = 'Add New Service Type';
      }
      else{
        this.updatePanelInfoViaApi(serviceTypeID);
      }
  }

  private updatePanelInfoViaApi(serviceTypeID: number) {
    //remove metadata from response
    const odataParams: string = `?$select=ServiceTypeName&$format=application/json;odata.metadata=none`;
    this.serviceTypeService.getServiceType(serviceTypeID, odataParams)
      .subscribe((data: IServiceType) => {
          this.panelHeaderInfo.panelTitle = `Edit ${data.ServiceTypeName}`;
      },
      err => console.log(err),
      () => console.log('completed subscription to updatePanelInfoViaApi'));
  }
}

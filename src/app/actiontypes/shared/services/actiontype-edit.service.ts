import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
// import { Subscription } from 'rxjs/Subscription'

import { RequestActionTypeService } from '../../../api';
import { IRequestActionType } from '../../../models';

export class ActionTypePanelHeaderInfo {
  panelTitle : string;
}

@Injectable()
export class ActionTypeEditService {

  private panelHeaderInfo: ActionTypePanelHeaderInfo = null;
  public actionTypeIDParam: number = null;

  constructor(private actionTypeService : RequestActionTypeService) {}

  getPanelInfo(actionTypeID: number) : ActionTypePanelHeaderInfo {
    //call web service to update panelheader info
    this.updatePanelInfo(actionTypeID);
    return this.panelHeaderInfo;
  }

  setActionTypeIDParam(actionTypeID : number){
    this.actionTypeIDParam = actionTypeID;
  }

  getActionTypeIDParam(): number{
    return this.actionTypeIDParam;
  }

  private updatePanelInfo(actionTypeID: number) {
      this.panelHeaderInfo = new ActionTypePanelHeaderInfo();
      if(actionTypeID === 0){
          this.panelHeaderInfo.panelTitle = 'Add New Action Type';
      }
      else{
        this.updatePanelInfoViaApi(actionTypeID);
      }
  }

  private updatePanelInfoViaApi(actionTypeID: number) {
    //remove metadata from response
    const odataParams: string = `?$select=RequestActionTypeName&$format=application/json;odata.metadata=none`;
    this.actionTypeService.getRequestActionType(actionTypeID, odataParams)
      .subscribe((data: IRequestActionType) => {
          this.panelHeaderInfo.panelTitle = `Edit ${data.RequestActionTypeName}`;
      },
      err => console.log(err),
      () => console.log('completed subscription to updatePanelInfoViaApi'));
  }
}

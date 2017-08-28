import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SpinnerService } from '../../infrastructure';
import { RequestActionTypeService } from '../../api'
import { IRequestActionType } from '../../models'

@Component({
  selector: 'app-actiontype-list',
  templateUrl: './actiontype-list.component.html',
  styleUrls: ['./actiontype-list.component.css']
})
export class ActionTypeListComponent implements OnInit {

  actionTypes: IRequestActionType[] = [];

  constructor(private spinnerService : SpinnerService,
  private requestActionTypeService: RequestActionTypeService,
  private router: Router) {}

  ngOnInit() {
    this.getActionTypeList();
  }

  goToActionType(actionTypeID: number) {
    this.router.navigate(['/ActionTypes', actionTypeID]);
  }

  getActionTypeList() {
    this.actionTypes = [];
    const odataParams: string = `?$filter=(SystemReservedFlag eq false)&$orderby=RequestActionTypeName`;
    this.requestActionTypeService.getRequestActionTypes(odataParams)
      .subscribe(data => {
        this.actionTypes = data;
      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed getRequestActionTypes subscription');
      });
  }
}

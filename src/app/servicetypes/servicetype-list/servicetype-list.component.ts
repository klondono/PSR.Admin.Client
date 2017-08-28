import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SpinnerService } from '../../infrastructure';
import { ServiceTypeService } from '../../api'
import { IServiceType } from '../../models'

@Component({
  selector: 'app-servicetype-list',
  templateUrl: './servicetype-list.component.html',
  styleUrls: ['./servicetype-list.component.css']
})
export class ServiceTypeListComponent implements OnInit {

  serviceTypes: IServiceType[] = [];

  constructor(private spinnerService : SpinnerService,
  private serviceTypeService: ServiceTypeService,
  private router: Router) {}

  ngOnInit() {
    this.getServiceTypeList();
  }

  goToServiceType(serviceTypeID: number) {
    this.router.navigate(['/ServiceTypes', serviceTypeID]);
  }

  getServiceTypeList() {
    this.serviceTypes = [];
    const odataParams: string = `?$orderby=ServiceTypeName&$expand=ServiceTypeOwnerGroup`;
    this.serviceTypeService.getServiceTypesAndCacheResult(odataParams)
      .subscribe(data => {
        this.serviceTypes = data;
      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed getServiceTypes subscription');
      });
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { RequestOptions } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { PACommonModule } from './pa.common/pa.common.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DbObjectService, RequestActionTypeCustomFieldService, ServiceTypeService, CustomFieldTypeService, CustomFieldDataTypeService, ServiceTypeOwnerGroupService, RequestActionTypeService, ServiceTypeRequestActionTypeLinkService, ServiceTypeCustomFieldService, ServiceTypeSearchKeywordService, RequestStatusService, RequestOriginService, ServiceTypeRelationshipDefinitionService} from './api';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CustomToastOption } from './infrastructure/config/toastr-options';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    PACommonModule,
    InfrastructureModule,
    ToastModule.forRoot()
  ],
  providers: [
  {provide: ToastOptions, useClass: CustomToastOption},
  ServiceTypeService,
  ServiceTypeOwnerGroupService,
  ServiceTypeCustomFieldService,
  ServiceTypeRequestActionTypeLinkService,
  RequestActionTypeService,
  RequestActionTypeCustomFieldService,
  ServiceTypeSearchKeywordService,
  RequestStatusService,
  RequestOriginService,
  CustomFieldTypeService,
  CustomFieldDataTypeService,
  DbObjectService,
  ServiceTypeRelationshipDefinitionService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(requestOptions: RequestOptions) {
    //ensure response is in json format
    requestOptions.headers.set('Content-Type', 'application/json');
  }
}

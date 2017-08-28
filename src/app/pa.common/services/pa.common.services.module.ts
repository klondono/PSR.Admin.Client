import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http'

import { UserService } from './users/user.service';
import { FolioService } from './folios/folio.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  providers:[UserService, FolioService]
})
export class PACommonServicesModule { }

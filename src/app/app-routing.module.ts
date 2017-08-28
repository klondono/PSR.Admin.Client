import { NgModule } from '@angular/core';
import { PreloadAllModules, NoPreloading, Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ServiceTypes' },
  { path: 'Home', component: HomeComponent},
  { path: 'ServiceTypes', loadChildren: 'app/servicetypes/servicetypes.module#ServiceTypesModule'},
  { path: 'Workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule'},
  { path: 'ActionTypes', loadChildren: 'app/actiontypes/actiontypes.module#ActionTypesModule'}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes,
    { useHash: true,
      //lazily load child modules in the background
      preloadingStrategy:PreloadAllModules })
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }

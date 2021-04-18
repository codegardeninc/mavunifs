import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KycPage } from './kyc.page';

const routes: Routes = [
  {
    path: '',
    component: KycPage
  },
  {
    path: 'kin',
    loadChildren: () => import('./kin/kin.module').then( m => m.KinPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KycPageRoutingModule {}

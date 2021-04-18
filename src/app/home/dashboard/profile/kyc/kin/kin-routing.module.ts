import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KinPage } from './kin.page';

const routes: Routes = [
  {
    path: '',
    component: KinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KinPageRoutingModule {}

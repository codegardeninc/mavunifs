import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmeDataPage } from './sme-data.page';

const routes: Routes = [
  {
    path: '',
    component: SmeDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmeDataPageRoutingModule {}

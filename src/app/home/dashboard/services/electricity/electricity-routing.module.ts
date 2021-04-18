import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElectricityPage } from './electricity.page';

const routes: Routes = [
  {
    path: '',
    component: ElectricityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectricityPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirtimePage } from './airtime.page';

const routes: Routes = [
  {
    path: '',
    component: AirtimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AirtimePageRoutingModule {}

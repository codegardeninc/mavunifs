import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewpinPage } from './newpin.page';

const routes: Routes = [
  {
    path: '',
    component: NewpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewpinPageRoutingModule {}

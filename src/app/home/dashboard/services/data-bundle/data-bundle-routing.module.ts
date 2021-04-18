import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataBundlePage } from './data-bundle.page';

const routes: Routes = [
  {
    path: '',
    component: DataBundlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataBundlePageRoutingModule {}

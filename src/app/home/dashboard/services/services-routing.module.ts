import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesPage } from './services.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesPage
  },
  {
    path: 'electricity',
    loadChildren: () => import('./electricity/electricity.module').then( m => m.ElectricityPageModule)
  },
  {
    path: 'airtime',
    loadChildren: () => import('./airtime/airtime.module').then( m => m.AirtimePageModule)
  },
  {
    path: 'data',
    loadChildren: () => import('./data/data.module').then( m => m.DataPageModule)
  },
  {
    path: 'cable-tv',
    loadChildren: () => import('./cable-tv/cable-tv.module').then( m => m.CableTvPageModule)
  },
  {
    path: 'data-bundle',
    loadChildren: () => import('./data-bundle/data-bundle.module').then( m => m.DataBundlePageModule)
  },
  {
    path: 'fund-transfer',
  loadChildren: () => import('../../dashboard/savings/withdraw/withdraw.module').then( m => m.WithdrawPageModule)
  },
  {
    path: 'sme-data',
    loadChildren: () => import('./sme-data/sme-data.module').then( m => m.SmeDataPageModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'kyc',
    loadChildren: () => import('./kyc/kyc.module').then( m => m.KycPageModule)
  },
  {
    path: 'notification-setting',
    loadChildren: () => import('./notification-setting/notification-setting.module').then( m => m.NotificationSettingPageModule)
  },
  {
    path: 'refer',
    loadChildren: () => import('./refer/refer.module').then( m => m.ReferPageModule)
  },
  {
    path: 'refer/:code',
    loadChildren: () => import('./refer/refer.module').then( m => m.ReferPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}

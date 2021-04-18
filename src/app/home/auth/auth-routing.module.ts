import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutoLoginGuard } from 'src/app/guards/auto-login.guard';
import { UserGuard } from 'src/app/guards/user.guard';
import { WalkthroughGuard } from 'src/app/guards/walkthrough.guard';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    // canLoad: [UserGuard]
    canLoad: [AutoLoginGuard, UserGuard, WalkthroughGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),
    canLoad: [AutoLoginGuard, WalkthroughGuard]
  },
  {
    path: 'create-pin',
    loadChildren: () => import('./create-pin/create-pin.module').then( m => m.CreatePinPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'newpin',
    loadChildren: () => import('./newpin/newpin.module').then( m => m.NewpinPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then( m => m.TransactionsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'loans',
    loadChildren: () => import('./loans/loans.module').then( m => m.LoansPageModule)
  },
  // {
  //   path: 'investments',
  //   loadChildren: () => import('./investments/investments.module').then( m => m.InvestmentsPageModule)
  // },
  // {
  //   path: 'savings',
  //   loadChildren: () => import('./savings/savings.module').then( m => m.SavingsPageModule)
  // },
  {
    path: 'services',
    loadChildren: () => import('./services/services.module').then( m => m.ServicesPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'failure',
    loadChildren: () => import('./failure/failure.module').then( m => m.FailurePageModule)
  },
  {
    path: 'confirmation',
    loadChildren: () => import('./confirmation/confirmation.module').then( m => m.ConfirmationPageModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./verification/verification.module').then( m => m.VerificationPageModule)
  },
  {
    path: 'transaction-confirmation',
    loadChildren: () => import('./transaction-confirmation/transaction-confirmation.module').then( m => m.TransactionConfirmationPageModule)
  },
  {
    path: 'card-verification',
    loadChildren: () => import('./card-verification/card-verification.module').then( m => m.CardVerificationPageModule)
  },
  {
    path: 'profile-modal',
    loadChildren: () => import('./profile-modal/profile-modal.module').then( m => m.ProfileModalPageModule)
  },
  {
    path: 'card-confirmation',
    loadChildren: () => import('./card-confirmation/card-confirmation.module').then( m => m.CardConfirmationPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}

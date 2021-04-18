import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
          },
        ],
      },
      // {path: 'dashboard/loan',loadChildren: () => import('../dashboard/loans/loans.module').then(m => m.LoansPageModule)},
      // {path: 'dashboard/services',loadChildren: () => import('../dashboard/services/services.module').then(m => m.ServicesPageModule)},
      // {path: 'dashboard/investments',loadChildren: () => import('../dashboard/investments/investments.module').then(m => m.InvestmentsPageModule)},
      // {
      //   path: 'savings',
      //   loadChildren: () => import('../dashboard/savings/savings.module').then(m => m.SavingsPageModule)
      // },
      {
        path: 'wallet',
        loadChildren: () => import('../dashboard/wallet/wallet.module').then(m => m.WalletPageModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('../dashboard/transactions/transactions.module').then(m => m.TransactionsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../dashboard/profile/profile.module').then(m => m.ProfilePageModule)
      },
    ]
  },
  {
    path: '/user/dashboard',
    redirectTo: '/user/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
 
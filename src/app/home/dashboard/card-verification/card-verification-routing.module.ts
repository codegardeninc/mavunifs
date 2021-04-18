import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardVerificationPage } from './card-verification.page';

const routes: Routes = [
  {
    path: '',
    component: CardVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardVerificationPageRoutingModule {}

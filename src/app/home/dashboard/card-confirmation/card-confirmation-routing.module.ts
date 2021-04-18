import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardConfirmationPage } from './card-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: CardConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardConfirmationPageRoutingModule {}

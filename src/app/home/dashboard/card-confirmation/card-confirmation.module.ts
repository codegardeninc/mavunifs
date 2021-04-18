import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardConfirmationPageRoutingModule } from './card-confirmation-routing.module';

import { CardConfirmationPage } from './card-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardConfirmationPageRoutingModule
  ],
  //declarations: [CardConfirmationPage]
})
export class CardConfirmationPageModule {}

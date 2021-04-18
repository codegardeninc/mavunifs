import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardVerificationPageRoutingModule } from './card-verification-routing.module';

import { CardVerificationPage } from './card-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardVerificationPageRoutingModule
  ],
  //declarations: [CardVerificationPage]
})
export class CardVerificationPageModule {}

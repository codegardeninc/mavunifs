import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FundTransferPageRoutingModule } from './fund-transfer-routing.module';

import { FundTransferPage } from './fund-transfer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FundTransferPageRoutingModule
  ],
  declarations: [FundTransferPage]
})
export class FundTransferPageModule {}

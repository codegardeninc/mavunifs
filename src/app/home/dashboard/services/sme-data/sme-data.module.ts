import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmeDataPageRoutingModule } from './sme-data-routing.module';

import { SmeDataPage } from './sme-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmeDataPageRoutingModule
  ],
  declarations: [SmeDataPage]
})
export class SmeDataPageModule {}

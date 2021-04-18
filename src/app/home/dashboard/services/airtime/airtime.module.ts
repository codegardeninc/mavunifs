import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AirtimePageRoutingModule } from './airtime-routing.module';

import { AirtimePage } from './airtime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AirtimePageRoutingModule
  ],
  declarations: [AirtimePage]
})
export class AirtimePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KinPageRoutingModule } from './kin-routing.module';

import { KinPage } from './kin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KinPageRoutingModule
  ],
  declarations: [KinPage]
})
export class KinPageModule {}

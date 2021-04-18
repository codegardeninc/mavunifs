import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePinPageRoutingModule } from './create-pin-routing.module';

import { CreatePinPage } from './create-pin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePinPageRoutingModule
  ],
  declarations: [CreatePinPage]
})
export class CreatePinPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewpinPageRoutingModule } from './newpin-routing.module';

import { NewpinPage } from './newpin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewpinPageRoutingModule
  ],
  declarations: [NewpinPage]
})
export class NewpinPageModule {}

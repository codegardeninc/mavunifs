import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CableTvPageRoutingModule } from './cable-tv-routing.module';

import { CableTvPage } from './cable-tv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CableTvPageRoutingModule
  ],
  declarations: [CableTvPage]
})
export class CableTvPageModule {}

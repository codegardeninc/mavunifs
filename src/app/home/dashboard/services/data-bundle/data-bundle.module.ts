import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataBundlePageRoutingModule } from './data-bundle-routing.module';

import { DataBundlePage } from './data-bundle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataBundlePageRoutingModule
  ],
  declarations: [DataBundlePage]
})
export class DataBundlePageModule {}

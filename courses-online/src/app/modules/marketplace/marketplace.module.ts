import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    SharedModule,

    FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  RouterModule,
  ]
})
export class MarketplaceModule { }

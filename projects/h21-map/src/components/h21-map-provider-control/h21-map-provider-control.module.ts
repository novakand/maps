import { MatRadioModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// models
import { ProviderCheckbox } from '../../models/provider-checkbox-model';

// components
import { H21MapProviderControlComponent } from './h21-map-provider-control.component';

@NgModule({
  imports: [
    CommonModule,
    MatRadioModule,
  ],
  providers: [
    ProviderCheckbox,
  ],
  declarations: [
    H21MapProviderControlComponent,
  ],
  exports: [
    H21MapProviderControlComponent,
  ],
})
export class H21MapProviderControlModule { }

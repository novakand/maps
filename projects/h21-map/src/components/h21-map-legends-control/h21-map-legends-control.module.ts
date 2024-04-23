import { MatCheckboxModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// components
import { H21MapLegendsControlComponent } from './h21-map-legends-control.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
  ],
  declarations: [
    H21MapLegendsControlComponent,
  ],
  exports: [
    H21MapLegendsControlComponent,
  ],
})
export class H21MapLegendsControlModule { }

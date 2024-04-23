import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatTooltipModule
} from '@angular/material';

// components
import { H21MapFullscreenControlComponent } from './h21-map-fullscreen-control.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [
    H21MapFullscreenControlComponent,
  ],
  exports: [
    H21MapFullscreenControlComponent,
  ],
})
export class H21MapFullscreenControlModule { }

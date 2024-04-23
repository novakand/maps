import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// components
import { H21MapZoomControlComponent } from './h21-map-zoom-control.component';

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
    H21MapZoomControlComponent,
  ],
  exports: [
    H21MapZoomControlComponent,
  ],
})
export class H21MapZoomControlModule { }

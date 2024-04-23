import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';

// components
import { H21MapPoiToggleControlComponent } from './h21-map-poi-toggle-control.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [
    H21MapPoiToggleControlComponent,
  ],
  exports: [
    H21MapPoiToggleControlComponent,
  ],
})
export class H21MapPoiToggleControlModule { }

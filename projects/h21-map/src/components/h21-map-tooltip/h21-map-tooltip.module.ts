import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// components
import { H21MapTooltipComponent } from './h21-map-tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    H21MapTooltipComponent,
  ],
  exports: [
    H21MapTooltipComponent,
  ],
})
export class H21MapTooltipModule { }

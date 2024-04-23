import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { H21MapInfoBoxComponent } from './h21-map-info-box.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    H21MapInfoBoxComponent,
  ],
  exports: [
    H21MapInfoBoxComponent,
  ],
})
export class H21MapInfoBoxModule { }

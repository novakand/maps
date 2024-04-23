import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// components
import { H21MapPreloaderComponent } from './h21-map-preloader.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    H21MapPreloaderComponent,
  ],
  exports: [
    H21MapPreloaderComponent,
  ],
})
export class H21MapPreloaderModule { }

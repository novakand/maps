import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// components
import { H21MapSlidePanelComponent } from './h21-map-slide-panel.component';

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
    H21MapSlidePanelComponent,
  ],
  exports: [
    H21MapSlidePanelComponent,
  ],
})
export class H21MapSlidePanelModule {
}

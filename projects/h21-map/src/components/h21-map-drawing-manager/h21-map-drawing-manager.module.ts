import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// components
import { H21MapDrawingManagerComponent } from './h21-map-drawing-manager.component';

import { DrawingButtons } from '../../models/drawing-buttons.model';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [
    DrawingButtons,
  ],
  declarations: [
    H21MapDrawingManagerComponent,
  ],
  exports: [
    H21MapDrawingManagerComponent,
  ],
})
export class H21MapDrawingManagerModule { }

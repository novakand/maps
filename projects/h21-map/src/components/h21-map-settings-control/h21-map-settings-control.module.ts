import { MatButtonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// components
import { H21MapSettingsControlComponent } from './h21-map-settings-control.component';

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
    H21MapSettingsControlComponent,
  ],
  exports: [
    H21MapSettingsControlComponent,
  ],
})
export class H21MapSettingsControlModule {
}

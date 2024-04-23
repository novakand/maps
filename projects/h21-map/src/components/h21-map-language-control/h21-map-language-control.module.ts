import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// components
import { H21MapLanguageControlComponent } from './h21-map-language-control.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
  ],
  declarations: [
    H21MapLanguageControlComponent,
  ],
  exports: [
    H21MapLanguageControlComponent,
  ],
})
export class H21MapLanguageControlModule {
}

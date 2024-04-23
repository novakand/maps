import { MatAutocompleteModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// components
import { H21MapAutocompleteComponent } from './h21-map-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  declarations: [
    H21MapAutocompleteComponent,
  ],
  exports: [
    H21MapAutocompleteComponent,
  ],
})
export class H21MapAutocompleteModule { }

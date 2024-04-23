import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material';
// modules
import { CoreModule } from './core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// components
import { AppComponent } from './app.component';
import { H21MapsComponent } from './components/h21-maps';
import { H21MapsModule } from 'projects/h21-map/src/modules';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    H21MapsComponent,
    AppComponent,
  ],
  imports: [
    MatMenuModule,
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    H21MapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

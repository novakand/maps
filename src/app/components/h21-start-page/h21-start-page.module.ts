import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { CommonModule } from '@angular/common';

// components
import { H21StartPageComponent } from './h21-start-page.component';

@NgModule({
    declarations: [
        H21StartPageComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
    ],
    exports: [
        H21StartPageComponent,
    ],
    entryComponents: [
        H21StartPageComponent,
    ],
})
export class H21StartPageModule {

    constructor(@Optional() @SkipSelf() parentModule: H21StartPageModule) {
        if (parentModule) {
            throw new Error('H21StartPageModule is already loaded');
        }
    }

}

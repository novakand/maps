import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { App } from '../../shared/enums';
import { AvailableServicesService } from '../../core/services/available-services.service';

@Component({
    selector: 'app-h21-start-page',
    templateUrl: './h21-start-page.component.html',
    styleUrls: ['./h21-start-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class H21StartPageComponent {

    public app = App;
    public services$ = this._service.getAvailableServices();

    constructor(private _router: Router,
        private _service: AvailableServicesService,
        @Inject(DOCUMENT) private document: Document,
    ) { }

    public navigate(url: string): void {
        this.document.location.href = url;
    }

    public trackByFn(index): number {
        return index;
    }

}

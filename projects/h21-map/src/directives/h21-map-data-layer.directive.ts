import {
    AfterViewInit,
    Directive,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChange
} from '@angular/core';

// external libs
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// enums
import { EventType } from '../enums/event-type.enum';

// services
import { MapManager } from '../manager/map-manager';

@Directive({
    selector: '[h21MapDataLayer]',
})
export class H21MapDataLayerDirective implements AfterViewInit, OnChanges, OnDestroy {

    @Input() public geoJson: any;

    @Output() public clusterClick: Subject<MouseEvent> = new Subject<MouseEvent>();
    @Output() public markerClick: Subject<MouseEvent> = new Subject<MouseEvent>();
    @Output() public markerMouseOut: Subject<MouseEvent> = new Subject<MouseEvent>();
    @Output() public markerMouseOver: Subject<MouseEvent> = new Subject<MouseEvent>();

    private _addService: boolean;
    private _destroy$ = new Subject<boolean>();

    constructor(private _manager: MapManager, private _zone: NgZone) { }

    public ngAfterViewInit(): void {

        this._manager.getMap().loadMap$
            .pipe(
                filter(Boolean),
                takeUntil(this._destroy$),
            )
            .subscribe({
                next: () => { this._zone.run(() => this.onInit()); },
            });
    }

    public onInit(): void {
        if (!this._manager.getMap().dataLayer) { return; }
        if (this._addService) { return; }
        this._manager.getMap().dataLayer.addDataLayer(this);
        this._addService = true;
        this._addEventListeners();
    }

    public ngOnChanges(changes: { [key: string]: SimpleChange }): void {
        if (!this._addService) { return; }
        changes.geoJson && this._manager.getMap().dataLayer.updateDataLayer(this);
    }

    public ngOnDestroy(): void { this.onDestroy(); }

    public onDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
        this._manager.getMap().dataLayer.removeDataLayer(this);
        this._addService = false;
    }

    private _addEventListeners(): void {
        this._manager.getMap().dataLayer.createEventMouseClick(this)
            .pipe(takeUntil(this._destroy$))
            .subscribe((event: any) => {
                const eventAction = event.type === 'Cluster';
                eventAction ? this.clusterClick.next(event) : this.markerClick.next(event);
            });

        this._manager.getMap().dataLayer.createEventMouseOver(this)
            .pipe(takeUntil(this._destroy$))
            .subscribe((event: any) => {
                if (event.type === 'Cluster') { return; }
                this.markerMouseOver.next(event);
            });

        this._manager.getMap().dataLayer.createEventMouseOut(this)
            .pipe(takeUntil(this._destroy$))
            .subscribe((event: any) => {
                this.markerMouseOut.next(event);
            });

    }

}

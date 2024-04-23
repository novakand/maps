import {
  AfterViewInit,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange
} from '@angular/core';

// external libs
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// models
import { ClientPosition } from '../models/event-client-pixel.model';

// enums
import { AnimateType } from '../enums/animate.type';

// services
import { MapManager } from '../manager/map-manager';

let markerId = 0;

@Directive({
  selector: '[h21MapMarker]',
})
export class H21MapMarkerDirective implements OnDestroy, OnChanges, AfterViewInit {

  @Input() public latitude = 0;
  @Input() public longitude = 0;
  @Input() public isCluster = false;
  @Input() public fitBounds = false;
  @Input() public iconUrl = null;
  @Input() public iconWidth = 24;
  @Input() public iconHeight = 24;
  @Input() public iconZIndex = 99;
  @Input() public labelClass = 'h21-map-price-marker';
  @Input() public labelActiveClass = 'h21-map-price-marker active';
  @Input() public isLabelActive = false;
  @Input() public labelContent = null;
  @Input() public animate: AnimateType = null;

  @Output() public markerClick: Subject<ClientPosition> = new Subject<ClientPosition>();
  @Output() public markerDragEnd: Subject<MouseEvent> = new Subject<MouseEvent>();
  @Output() public markerMouseOver: Subject<ClientPosition> = new Subject<ClientPosition>();
  @Output() public markerMouseOut: Subject<MouseEvent> = new Subject<MouseEvent>();

  private readonly _id: string;
  private _markerAddService = false;
  private _destroy$ = new Subject<boolean>();

  constructor(private _manager: MapManager) { this._id = (markerId++).toString(); }

  public id(): string { return this._id; }

  public toString(): string { return `markerId-${this._id}`; }

  public ngAfterViewInit(): void { this.onInit(); }

  public onInit(): void {
    if (!this._manager.getMap().marker) { return; }
    if (this._markerAddService) { return; }

    this._manager.getMap().marker.addMarker(this);
    this._addEventListeners();
    this._markerAddService = true;

  }

  public ngOnChanges(changes: { [key: string]: SimpleChange }): void {
    if (!this._markerAddService) { return; }
    if (typeof this.latitude !== 'number'
      || typeof this.longitude !== 'number') { return; }

    (changes.latitude || changes.longitude) && this._manager.getMap().marker.setPosition(this);
    (changes.iconUrl || changes.iconWidth || changes.iconHeight) && this._manager.getMap().marker.setIcon(this);
    changes.iconZIndex && this._manager.getMap().marker.setZIndex(this);
    changes.animate && this._manager.getMap().marker.setAnimation(this);
    changes.labelContent && this._manager.getMap().marker.setLabelContent(this);
    changes.isLabelActive && this._manager.getMap().marker.setLabelClass(this);
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._manager.getMap().marker.removeMarker(this);
  }

  public onDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._manager.getMap().marker.removeMarkers();
  }

  private _addEventListeners(): void {
    this._manager.getMap().marker.createEventMouseClick(this)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => { this.markerClick.next(<ClientPosition>event); });

    this._manager.getMap().marker.createEventMouseOver(this)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => { this.markerMouseOver.next(<ClientPosition>event); });

    this._manager.getMap().marker.createEventMouseOut(this)
      .pipe(takeUntil(this._destroy$))
      .subscribe((event) => { this.markerMouseOut.next(<MouseEvent>event); });

  }

}

import { Injectable } from '@angular/core';

// external libs
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// models
import { AreaEvent } from '.././models/area-event.model';
import { Bounds } from '.././models/bounds-map.model';
import { CircleEvent } from '.././models/circle-event.model';
import { MarkerEvent } from '.././models/marker-event.model';
import { MapStateOptions } from '../models/map-state-options.model';
import { Position } from '.././models/position.model';
import { EventLoad } from '../models/event-load.model';

// enums
import { EventType } from '../enums/event-type.enum';
import { RouteMode } from '../enums/route-type.enum';

// services
import { MapManager } from '../manager/map-manager';

@Injectable()
export class H21MapSaveService {

  private _manager: MapManager;
  private _destroy$ = new Subject<boolean>();
  private _mapState = new MapStateOptions({});
  private _mapSaveService: boolean;

  constructor() {
  }

  public initService(manager: MapManager): void {
    this._manager = manager;
    this._addEventListeners();
    this._addEventListenerDraw();
  }

  public destroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public reset(): void {
    this._mapState = new MapStateOptions({});
  }

  public getMapOptions(): any {
    this._getRoutes();
    return this._mapState;
  }

  private _getRoutes(): void {
    this._manager.getMap().route.routes.forEach((value, key) => {
      if (key.routeMode === RouteMode.transit) {
        return;
      }
      this._mapState.routes = ({
        startLatitude: key.startLatitude,
        startLongitude: key.startLongitude,
        endLatitude: key.endLatitude,
        endLongitude: key.endLongitude,
        strokeColor: key.routeStrokeColor,
        strokeWeight: key.routeStrokeWeight,
        routeMode: key.routeMode,
      });
    });
    this._manager.getMap().route.removeRoutes();
  }

  private _addEventListeners() {
    try {
      this._manager.getMap().events.createEventZoomChange()
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (zoom: number) => {
            this._mapState.zoom = zoom;
          },
        });

      this._manager.getMap().events.createEventCenterChange()
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (center: Position) => {
            this._mapState.center = center;
          },
        });

      this._manager.getMap().events.createEventBoundsChange()
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (bounds: Bounds) => {
            this._mapState.bounds = bounds;
          },
        });

      this._manager.getMap().events.createEventload()
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (eventLoad: EventLoad) => {
            if (!this._mapSaveService) {
              this._mapState.center = eventLoad.center;
              this._mapState.zoom = eventLoad.zoom;
              this._mapSaveService = true;
            }
          },
        });
    } catch {
    }
  }

  private _addEventListenerDraw() {
    try {
      if (!this._manager.getMap().drawing.drawingManager) {
        return;
      }

      this._manager.getMap().drawing.createEvent(EventType.drawMode)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (event: any) => {
            this._mapState.drawMode = event;
          },
        });

      this._manager.getMap().drawing.createEvent(EventType.drawMarkerCreate)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (event: MarkerEvent) => {
            this._mapState.drawMarker = event;
            this._mapState.drawArea = null;
            this._mapState.drawCircle = null;
          },
        });

      this._manager.getMap().drawing.createEvent(EventType.drawMarkerRemove)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: () => {
            this._mapState.drawMarker = null;
          },
        });

      this._manager.getMap().drawing.createEvent(EventType.drawCircleCreate)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (event: CircleEvent) => {
            this._mapState.drawCircle = event;
            this._mapState.drawArea = null;
            this._mapState.drawMarker = null;

          },
        });

      this._manager.getMap().drawing.createEvent(EventType.drawCircleCentreComplete)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (event: CircleEvent) => {
            this._mapState.drawCircle = event;
            this._mapState.drawArea = null;
            this._mapState.drawMarker = null;
          },
        });

      this._manager.getMap().drawing.createEvent(EventType.drawCircleRadiusComplete)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (event: CircleEvent) => {
            this._mapState.drawCircle = event;
            this._mapState.drawArea = null;
            this._mapState.drawMarker = null;
          },
        });

      this._manager.getMap().drawing.createEvent(EventType.drawCircleRemove)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: () => {
            this._mapState.drawCircle = null;
          },
        });

      this._manager.getMap().drawing.createEvent(EventType.drawAreaCreate)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: (event: AreaEvent) => {
            this._mapState.drawArea = event;
            this._mapState.drawCircle = null;
            this._mapState.drawMarker = null;
          },
        });

      this._manager.getMap().drawing.createEvent(EventType.drawAreaRemove)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: () => {
            this._mapState.drawArea = null;
          },
        });

    } catch {
    }
  }

}

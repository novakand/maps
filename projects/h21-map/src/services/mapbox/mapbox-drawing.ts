import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// enums
import { EventType } from '../../enums/event-type.enum';

// models
import { MarkerEvent } from '../../models/marker-event.model';
import { CircleEvent } from '../../models/circle-event.model';
import { AreaEvent } from '../../models/area-event.model';

// services
import { DrawingManager } from '@h21-map/leaflet-drawing-manager';
import { DrawingService } from '../abstract/abstract-drawing';

// components
import { H21MapDrawingManagerComponent } from '../../components';

@Injectable()
export class MapboxDrawingService extends DrawingService<L.Map, L.Marker, L.Polyline> {

  constructor(private _zone: NgZone) {
    super();
  }

  public initDrawingManager(drawing: H21MapDrawingManagerComponent): void {
    try {
      this.drawingManager = new DrawingManager(this.map.api, this.map.drawing.createDrawingOptions(drawing));
      this._createEvent();
    } catch {
    }
  }

  public setMode(drawing: H21MapDrawingManagerComponent): void {
    this.drawingManager.setDrawingMode(drawing.drawingMode, this.map.drawing.createDrawingOptions(drawing));
  }

  public reset(): void {
    this.drawingManager.reset();
  }

  public remove(): void {
    try {
      this.drawingManager.remove();
    } catch {
    }
  }

  public addMarker(latitude: number, longitude: number): void {
    try {
      this.drawingManager.addMarker(latitude, longitude);
    } catch {
    }
  }

  public resetMarker(): void {
    this.drawingManager && this.drawingManager.resetMarker();
  }

  public isAnimateMarker(enabled: boolean): void {
    this.drawingManager.isAnimateMarker(enabled);
  }

  public destroy(): void {
  }

  public createEvent<A>(eventName: string): Observable<A> {
    return new Observable((observer: Observer<any>) => {
      this.map.api.on(eventName, (event) => this._zone.run(() => observer.next(this.map.conversions.translateEventDraw(event))));
    });
  }

  private _createEvent(): void {
    try {
      this.createEvent(EventType.drawMarkerCreate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (event: MarkerEvent) => {
            this.marker = event;
          },
        });

      this.createEvent(EventType.drawMarkerRemove)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.marker = null;
          },
        });

      this.createEvent(EventType.drawCircleCreate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (event: CircleEvent) => {
            this.circle = event;
          },
        });

      this.createEvent(EventType.drawCircleRemove)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.circle = null;
          },
        });

      this.createEvent(EventType.drawAreaCreate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (event: AreaEvent) => {
            this.area = event;
          },
        });

      this.createEvent(EventType.drawAreaRemove)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.area = null;
          },
        });
    } catch {
    }
  }

}

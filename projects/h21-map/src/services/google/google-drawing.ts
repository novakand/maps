import { Injectable, NgZone } from '@angular/core';
// libs
import { DrawingManager } from '@h21-map/google-drawing-manager';
// external libs
import { Observable, Observer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// components
import { H21MapDrawingManagerComponent } from '../../components/h21-map-drawing-manager/h21-map-drawing-manager.component';
// enums
import { EventType } from '../../enums/event-type.enum';
import { AreaEvent } from '../../models/area-event.model';
import { CircleEvent } from '../../models/circle-event.model';
// models
import { MarkerEvent } from '../../models/marker-event.model';
// services
import { DrawingService } from '../abstract/abstract-drawing';

@Injectable()
export class GoogleDrawingService extends DrawingService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  constructor(private _zone: NgZone) {
    super();
  }

  public initDrawingManager(drawing: H21MapDrawingManagerComponent): void {
    try {
      this.drawingManager = new DrawingManager(this.map.api, this.map.drawing.createDrawingOptions(drawing));
      this.drawingManager.setMap(this.map.api);
      this._createEvent();
    } catch {
    }

  }

  public setMode(drawing: H21MapDrawingManagerComponent): void {
    this.drawingManager.setDrawingMode(drawing.drawingMode, this.map.drawing.createDrawingOptions(drawing));
  }

  public reset(): void {
    try {
      this.drawingManager.reset();
    } catch {
    }
  }

  public remove(): void {
    try {
      this.drawingManager.remove();
    } catch {
    }
  }

  public resetMarker(): void {
    try {
      this.drawingManager.resetMarker();
    } catch {
    }
  }

  public addMarker(latitude: number, longitude: number): void {
    try {
      this.drawingManager.addMarker(latitude, longitude);
    } catch {
    }
  }

  public isAnimateMarker(enabled: boolean): void {
    this.drawingManager.isAnimateMarker(enabled);
  }

  public createEvent<T>(eventName: string): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      this.drawingManager.addListener(eventName, (event: T) => this._zone.run(() => observer.next(event)));
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

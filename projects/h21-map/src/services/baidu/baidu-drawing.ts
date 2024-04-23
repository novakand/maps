import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// libs
import { DrawingManager } from '@h21-map/baidu-drawing-manager';

// components
import { H21MapDrawingManagerComponent } from '../../components';

// enums
import { EventType } from '../../enums/event-type.enum';

// models
import { MarkerEvent } from '../../models/marker-event.model';
import { AreaEvent } from '../../models/area-event.model';
import { CircleEvent } from '../../models/circle-event.model';

// services
import { DrawingService } from '../abstract/abstract-drawing';

@Injectable()
export class BaiduDrawingService extends DrawingService<BMap.Map, BMap.Marker, BMap.Polyline> {

  constructor(private _zone: NgZone) {
    super();
  }

  public initDrawingManager(drawing: H21MapDrawingManagerComponent) {
    try {
      this.drawingManager = new DrawingManager(this.map.api, this.map.drawing.createDrawingOptions(drawing));
      this._createEvent();
    } catch { }
  }

  public setMode(drawing: H21MapDrawingManagerComponent) {
    try {
      this.drawingManager.setDrawingMode(drawing.drawingMode, this.map.drawing.createDrawingOptions(drawing));
    } catch { }
  }

  public reset(): void {
    this.drawingManager.reset();
  }

  public remove(): void {
    try {
      this.drawingManager.remove();
    } catch { }
  }

  public resetMarker(): void {
    this.drawingManager.resetMarker();
  }

  public addMarker(latitude: number, longitude: number): void {
    try {
      this.drawingManager.addMarker(latitude, longitude);
    } catch (error) { }
  }

  public isAnimateMarker(enabled: boolean): void {
    this.drawingManager.isAnimateMarker(enabled);
  }

  public createEvent<A>(eventName: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.drawingManager.addEventListener(eventName, (event) =>
        this._zone.run(() => observer.next(this.map.conversions.translateEventDraw(event))));
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
    } catch { }
  }

}

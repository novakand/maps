import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// enums
import { EventType } from '../enums';

// services
import { MapManager } from '../manager/map-manager';

// models
import { ClientPosition } from '../models/event-client-pixel.model';
import { Bounds } from '../models/bounds-map.model';
import { Position } from '../models/position.model';

@Injectable()
export class H21MapEventService {

  private _destroy$ = new Subject<boolean>();

  public destroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public addEventListeners<E>(manager: MapManager, eventType: EventType): Observable<E> {
    return new Observable((observer: Observer<E>) => {
      manager.getMap().events.createEvent(eventType)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (event: any) => {
          observer.next(<E>event);
        },
      });
    });
  }

  public addEventListenersZoom(manager: MapManager): Observable<number> {
    return new Observable((observer: Observer<number>) => {
      manager.getMap().events.createEventZoomChange()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (zoom) => {
          observer.next(zoom);
        },
      });
    });
  }

  public addEventListenersBounds(manager: MapManager): Observable<Bounds> {
    return new Observable((observer: Observer<Bounds>) => {
      manager.getMap().events.createEventBoundsChange()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (bounds) => {
          observer.next(bounds);
        },
      });

    });
  }

  public addEventListenersCenter(manager: MapManager): Observable<Position> {
    return new Observable((observer: Observer<Position>) => {
      manager.getMap().events.createEventCenterChange()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (center) => {
          observer.next(center);
        },
      });
    });
  }

  public addEventListenersRightClik(manager: MapManager): Observable<ClientPosition> {
    return new Observable((observer: Observer<ClientPosition>) => {
      manager.getMap().events.createEventRightClick()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (clentXY) => {
          observer.next(clentXY);
        },
      });
    });
  }

}


import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// constants
import { MapboxMapEvents } from '../../constanst/mapbox/mapbox-events-type.const';

// models
import { Position } from '../../models/position.model';
import { Bounds } from '../../models/bounds-map.model';

// services
import { EventService } from '../abstract/abstract-event';
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';
import { EventLoad } from '../../models/event-load.model';

@Injectable()
export class MapboxEventService extends EventService<L.Map, L.Marker, L.Polyline> {

  constructor(private _zone: NgZone) {
    super();
  }

  public createEvent<E>(eventName: string): Observable<E> {
    const leafletEventName: string = MapboxMapEvents[eventName];
    return new Observable((observer: Observer<any>) => {
      if (leafletEventName === 'click') {
        L.DomEvent.on(this.map.api.getContainer(), 'click', (ev) => {
          L.DomEvent.stopPropagation(ev);
          this._zone.run(() => observer.next(event));
        });
      } else {
        this.map.api.addEventListener(leafletEventName || '', (event) => {
          this._zone.run(() => observer.next(event));
        });
      }
    });
  }

  public createEventload(): Observable<EventLoad> {
    return new Observable((observer: Observer<EventLoad>) => {
      this.createEvent<any>('load').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateEventLoad()));
      });
    });
  }

  public createEventCenterChange(): Observable<Position> {
    return new Observable((observer: Observer<Position>) => {
      this.createEvent<any>('moveend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateCenter()));
      });
    });
  }

  public createEventBoundsChange(): Observable<Bounds> {
    return new Observable((observer: Observer<Bounds>) => {
      this.createEvent<any>('moveend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds()));

      });
      this.createEvent<any>('dragend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds()));

      });
    });
  }

  public createEventZoomChange(): Observable<number> {
    return new Observable((observer: Observer<number>) => {
      this.createEvent<any>('zoomend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.api.getZoom()));
      });
    });

  }

  public createEventRightClick(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('contextmenu').subscribe((event: IEventMouse) => {
        this._zone.run(() => observer.next(this.map.conversions.translateClientXY(event)));
      });
    });
  }

}

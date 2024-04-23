import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// constants
import { GoogleMapEvents } from '../../constanst/google/google-events-type.const';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// models
import { Bounds } from '../../models/bounds-map.model';
import { EventLoad } from '../../models/event-load.model';
import { Position } from '../../models/position.model';

// services
import { EventService } from '../abstract/abstract-event';

@Injectable()
export class GoogleEventService extends EventService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  constructor(private _zone: NgZone) {
    super();
  }

  public createEvent<E>(eventName: string): Observable<E> {
    const googleEventName: string = GoogleMapEvents[eventName];
    return new Observable((observer: Observer<E>) => {
      this.map.api.addListener(googleEventName, (event: any) => {
        this._zone.run(() => observer.next(event));
      });
    });
  }

  public createEventload(): Observable<EventLoad> {
    return new Observable((observer: Observer<EventLoad>) => {
      google.maps.event.addListenerOnce(this.map.api, 'tilesloaded', (event: any) => {
        this._zone.run(() => observer.next(this.map.conversions.translateEventLoad()));
      });
    });
  }

  public createEventBoundsChange(): Observable<Bounds> {
    return new Observable((observer: Observer<Bounds>) => {
      this.createEvent<any>('idle').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds()));
      });
    });
  }

  public createEventCenterChange(): Observable<Position> {
    return new Observable((observer: Observer<Position>) => {
      this.createEvent<any>('center_changed').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateCenter()));
      });
    });
  }

  public createEventZoomChange(): Observable<number> {
    return new Observable((observer: Observer<number>) => {
      this.createEvent<any>('zoom_changed').subscribe(() => {
        this._zone.run(() => observer.next(this.map.api.getZoom()));
      });
    });
  }

  public createEventRightClick(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.createEvent('rightclick').subscribe((event: IEventMouse) => {
        this._zone.run(() => observer.next(this.map.conversions.translateClientXY(event)));
      });
    });
  }

}

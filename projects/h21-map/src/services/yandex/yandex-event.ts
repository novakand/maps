import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// constants
import { YandexMapEvents } from '../../constanst/yandex/yandex-events-type.const';

// models
import { Position } from '../../models/position.model';
import { Bounds } from '../../models/bounds-map.model';
import { EventLoad } from '../../models/event-load.model';

// services
import { EventService } from '../abstract/abstract-event';
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

@Injectable()
export class YandexEventService extends EventService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  constructor(private _zone: NgZone) {
    super();
  }

  public createEvent<E>(eventName: string): Observable<E> {
    const yandexEventName: string = YandexMapEvents[eventName];
    return new Observable((observer: Observer<E>) => {
      this.map.api.events.add(yandexEventName, (event: any) => {
        this._zone.run(() => observer.next(event));
      });
    });
  }

  public createEventBoundsChange(): Observable<Bounds> {
    return new Observable((observer: Observer<Bounds>) => {
      this.createEvent<any>('boundschange').subscribe((event) => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds(event)));
      });
    });
  }

  public createEventCenterChange(): Observable<Position> {
    return new Observable((observer: Observer<Position>) => {
      this.createEvent<any>('boundschange').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateCenter()));
      });
    });
  }

  public createEventZoomChange(): Observable<number> {
    return new Observable((observer: Observer<number>) => {
      this.createEvent<any>('boundschange').subscribe((event) => {
        if (event.get('newZoom') !== event.get('oldZoom')) {
          this._zone.run(() => observer.next(event.get('newZoom')));
        }
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

  public createEventload(): Observable<EventLoad> {
    return;
  }

}

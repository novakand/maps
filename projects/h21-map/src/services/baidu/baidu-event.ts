import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// constant
import { BaiduMapEvents } from '../../constanst/baidu/baidu-events-type.const';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// models
import { Position } from '../../models/position.model';
import { Bounds } from '../../models/bounds-map.model';
import { EventLoad } from '../../models/event-load.model';

// services
import { EventService } from '../abstract/abstract-event';

@Injectable()
export class BaiduEventService extends EventService<BMap.Map, BMap.Marker, BMap.Polyline> {

  constructor(private _zone: NgZone) {
    super();
  }

  public createEvent<E>(eventName: string): Observable<E> {
    try {
      const baiduEventName: string = BaiduMapEvents[eventName];
      return new Observable((observer: Observer<E>) => {
        this.map.api.addEventListener(baiduEventName, (event: E) => {
          this._zone.run(() => observer.next(event));
        });
      });
    } catch (err) {
    }
  }

  public createEventCenterChange(): Observable<Position> {
    return new Observable((observer: Observer<Position>) => {
      this.createEvent('moveend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateCenter()));
      });
    });
  }

  public createEventBoundsChange(): Observable<Bounds> {
    return new Observable((observer: Observer<Bounds>) => {
      this.createEvent('zoomend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds()));
      });

      this.createEvent('dragend').subscribe(() => {
        this._zone.run(() => observer.next(this.map.conversions.translateBounds()));
      });
    });
  }

  public createEventZoomChange(): Observable<number> {
    return new Observable((observer: Observer<number>) => {
      this.createEvent('zoomend').subscribe(() => {
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

  public createEventload(): Observable<EventLoad> {
    return;
  }

}

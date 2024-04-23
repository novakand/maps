import { Injectable, NgZone } from '@angular/core';

// external libs
import { Observable, Observer, Subject } from 'rxjs';

// models
import { Position } from '../../models/position.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class GeolocationService<T, U, N> {

  public map: MapService<T, U, N>;
  public geoPosition: Subject<Position> = new Subject<Position>();

  constructor(
    private _zone: NgZone,
  ) { }

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public getGeoLocation(): Observable<Position> {
    return new Observable((observer: Observer<Position>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const position: Position = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          this._zone.run(() => observer.next(position));
          this.geoPosition.next(position);
        });
      } else {
        this._zone.run(() => observer.error(null));
        this.geoPosition.next(null);
      }
    });
  }

}

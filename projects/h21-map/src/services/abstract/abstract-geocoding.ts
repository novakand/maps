import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// models
import { Position } from '../../models/position.model';
import { Point } from '../../models/point.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class GeoCodingService<T, U, N> {

  public map: MapService<T, U, N>;

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public abstract getAddress(latitude: number, longitude: number): Observable<Point>;

  public abstract getCoordinates(address: string): Observable<Position>;

}

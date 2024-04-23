import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// enums
import { DistanceType } from '../../enums/distance-type.enums';

// models
import { Position } from '../../models/position.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class DistanceService<T, U, N> {

  public map: MapService<T, U, N>;

  private _token = 'pk.eyJ1IjoiaG9yc2UyMSIsImEiOiJjazNoZHFpb2QwYWw3M2htdTE3ejlobWdyIn0.znyyDs4gHiWL6xGqZYePkA';

  constructor(
    private _http: HttpClient,
  ) { }

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public getDistance(positions: Position[], type: DistanceType): Observable<number[]> {
    return new Observable((observer: Observer<any>) => {
      this._http.get<any>(`https://api.mapbox.com/directions-matrix/v1/mapbox/${ DistanceType[type] }/${ ''
        }${ this._getCoordinates(positions) }?sources=0&destinations=${ this._getDestinations(positions) }&annotations=distance${ ''
        }&access_token=${ this._token }`).subscribe((results) => {
        if (results && results.code === 'Ok') {
          observer.next(results.distances[0]);
        }
      }, (error) => {
        observer.error(null);
      });
    });

  }

  private _getCoordinates(positions: Position[]): string {
    const latLng = [];
    for (const item of positions) {
      latLng.push([item.longitude, item.latitude]);

    }
    return latLng.join(';');
  }

  private _getDestinations(positions: Position[]): string {
    const destinations = [];
    positions.forEach((item, index) => {
      destinations.push(index);
    });
    destinations.shift();
    return destinations.join(';');
  }

}

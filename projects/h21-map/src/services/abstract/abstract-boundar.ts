import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import { Observable, Subject } from 'rxjs';

// directives
import { H21MapBoundarDirective } from '../../directives/h21-map-boundar.directive';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class BoundarService<T, U, N> {

  public map: MapService<T, U, N>;
  public addBoundar$: Subject<Position[]> = new Subject<Position[]>();

  constructor(
    private _http: HttpClient,
  ) { }

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public abstract addBoundar(boundar: H21MapBoundarDirective): void;

  public abstract loadBoundar(url: string, boundar?: H21MapBoundarDirective): void;

  public abstract setStyle(boundar: H21MapBoundarDirective): void;

  public abstract removeBoundar(boundar: H21MapBoundarDirective): void;

  public abstract createEvent<E>(eventName: string, boundar?: H21MapBoundarDirective): Observable<E>;

  public getBoundar(name: string): Observable<any> {
    return new Observable((observer) => {
      this._http.get<any>(`https://nominatim.openstreetmap.org/search?${ '' }
            q=${ name }&polygon_geojson=1&format=geocodejson&limit=1`).subscribe((results) => {
        if (results) {
          if (!results.features.length || results.features[0].geometry.type === 'Point') {
            return;
          }
          observer.next(results);
        } else {
          observer.next(null);
        }

      }, () => {
        observer.error(null);
      });
    });
  }

}

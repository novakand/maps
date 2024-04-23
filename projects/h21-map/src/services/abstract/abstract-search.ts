import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// models
import { Point } from '../../models/point.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class SearchService<T, U, N> {

  public map: MapService<T, U, N>;

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public abstract searchDetails(placeId: string): Observable<Point>;

  public abstract searchAutocomplete(query: string, isCities?: boolean): Observable<Point[]>;

}

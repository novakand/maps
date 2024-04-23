import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// enums
import { BaiduPlaceType } from '../../enums/baidu/baidu-place-type';
import { PointServiceType } from '../../enums/point-service-type.enum';
import { ProviderName } from '../../enums/provider-name.enum';

// models
import { Position } from '../../models/position.model';
import { PointAddress } from '../../models/point-address.model';
import { Point } from '../../models/point.model';

// services
import { SearchService } from '../abstract/abstract-search';

@Injectable()
export class BaiduSearchService extends SearchService<BMap.Map, BMap.Marker, BMap.Polyline> {

  constructor() {
    super();
  }

  public searchAutocomplete(query: string): Observable<Point[]> {
    const result = [];
    let local: BMap.LocalSearch;
    return new Observable((observer: Observer<Point[]>) => {
      const options = {
        onSearchComplete: (results) => {
          if (local.getStatus() === BMAP_STATUS_SUCCESS) {
            for (let i = 0; i < results.getCurrentNumPois(); i++) {
              const place: BMap.LocalResultPoi = results.getPoi(i);
              if (place) {
                const point = new Point();
                point.name = place.title;
                point.id = place.uid;
                point.type = PointServiceType.internet;
                point.provider = ProviderName.baidu;
                point.position = new Position(place.point.lat, place.point.lng);
                point.address = new PointAddress();
                point.address.city = place.city;
                point.address.district = place.province;
                point.address.postCode = place.postcode;
                point.address.description = place.address;
                point.subtype = this._getType(place);
                result.push(point);
              }
            }
          }
          observer.next(result);
        },
      };
      local = new BMap.LocalSearch(this.map.api, options);
      local.search(query);
    });
  }

  public searchDetails(placeId: string): Observable<Point> {
    throw new Error('Method not implemented.');
  }

  private _getType(place: any): string {
    let type = 'city';
    if (place.tags) {
      type = BaiduPlaceType[place.tags[0]] || type;
    }
    return type;

  }

}

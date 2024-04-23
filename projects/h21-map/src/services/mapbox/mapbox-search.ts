import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// external  libs
import { Observable, Observer } from 'rxjs';

// enums
import { MapboxLanguageKey } from '../../enums/mapbox/mapbox-language-key.enum';
import { MapboxPlaceType } from '../../enums/mapbox/mapbox-place-type.enum';
import { PointServiceType } from '../../enums/point-service-type.enum';
import { ProviderName } from '../../enums/provider-name.enum';

// interfaces
import { Point } from '../../models/point.model';

// models
import { PointAddress } from '../../models/point-address.model';
import { Position } from '../../models/position.model';

// services
import { SearchService } from '../abstract/abstract-search';

@Injectable()
export class MapboxSearchService extends SearchService<L.Map, L.Marker, L.Polyline> {

  constructor(private _http: HttpClient) {
    super();
  }

  public searchAutocomplete(query: string): Observable<Point[]> {
    try {
      const result = [];
      return new Observable((observer) => {
        this._http.get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${''
          }limit=5&autocomplete=true&language=${MapboxLanguageKey[this.map.apiConfig.language]}${''
          }&access_token=${this.map.apiConfig.key}`).subscribe((results) => {
            if (results) {
              for (const place of results.features) {
                const point = new Point();
                point.id = null;
                point.subtype = MapboxPlaceType[place.place_type[0]];
                point.provider = ProviderName.mapbox;
                point.googlePlaceId = null;
                point.placeId = place.id;
                point.position = new Position(place.geometry.coordinates[1], place.geometry.coordinates[0]);
                point.type = PointServiceType.internet;
                point.title = place.place_name;
                point.name = place.text;
                if (place.place_type[0] === 'poi' && place.properties.category) {
                  point.subtype = MapboxPlaceType[place.properties.category.split(',')[0]
                    || MapboxPlaceType[place.place_type[0]]];
                }
                if (!point.subtype) {
                  point.subtype = MapboxPlaceType[place.place_type[0]];
                }
                point.address = new PointAddress();
                const address = this.map.address.getDetailsAddress(place);
                if (address) {
                  point.address.city = address.city || '';
                  point.address.country = address.country || '';
                  point.address.district = address.district || '';
                  point.address.postCode = address.postCode || '';
                  point.address.countryCode = address.countryCode || '';
                  point.address.description = place.place_name;
                }
                result.push(point);
              }
              observer.next(<Point[]>result);
            } else {
              observer.error(null);
            }
          }, (error) => {
            observer.next(null);
          });
      });

    } catch {
    }
  }

  public searchDetails(placeId: string): Observable<Point> {
    return new Observable((observer: Observer<Point>) => {
      observer.next(null);

    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// external libs
import { Observable } from 'rxjs';

// enums
import { PointServiceType } from '../../enums/point-service-type.enum';
import { ProviderName } from '../../enums/provider-name.enum';
import { MapboxPlaceType } from '../../enums/mapbox/mapbox-place-type.enum';

// models
import { Position } from '../../models/position.model';
import { PointAddress } from '../../models/point-address.model';
import { Point } from '../../models/point.model';

// services
import { GeoCodingService } from '../abstract/abstract-geocoding';

@Injectable()
export class MapboxGeocodingService extends GeoCodingService<L.Map, L.Marker, L.Polyline> {

  constructor(private http: HttpClient) {
    super();
  }

  public getAddress(latitude: number, longitude: number): Observable<Point> {
    return new Observable((observer) => {
      this.http.get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?${''
        }&language=en&access_token=${this.map.apiConfig.key}&limit=1&`).subscribe((results) => {
          if (results) {
            for (const place of results.features) {
              const point = new Point();
              point.id = null;
              point.placeId = place.id;
              point.subtype = MapboxPlaceType[place.place_type[0]];
              point.provider = ProviderName.mapbox;
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

              const address = this.map.address.getDetailsAddress(place);
              if (address) {
                point.address = new PointAddress();
                point.address.city = address.city;
                point.address.country = address.country;
                point.address.district = address.district;
                point.address.postCode = address.postCode;
                point.address.countryCode = address.countryCode;
                point.address.description = place.place_name;
              }

              observer.next(point);
            }

          } else {
            observer.next(null);
          }

        }, () => {
          observer.next(null);
        });
    });
  }

  public getCoordinates(address: string): Observable<Position> {
    return new Observable((observer) => {
      this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?${''
        }types=address&language=en&access_token=${this.map.apiConfig.key}&limit=1&`).subscribe((results: any) => {
          if (results) {
            const place = results.features[0];
            observer.next(new Position(place.geometry.coordinates[1], place.geometry.coordinates[0]));

          } else {
            observer.next(null);
          }

        }, () => {
          observer.next(null);
        });
    });
  }

}

import { Injectable } from '@angular/core';

//  external libs
import { Observable } from 'rxjs';

// enums
import { PointServiceType } from '../../enums/point-service-type.enum';
import { ProviderName } from '../../enums/provider-name.enum';
import { YandexPlaceType } from '../../enums/yandex/yandex-place-type';

// models
import { Position } from '../../models/position.model';
import { Point } from '../../models/point.model';
import { PointAddress } from '../../models/point-address.model';

// services
import { GeoCodingService } from '../abstract/abstract-geocoding';

@Injectable()
export class YandexGeocodingService extends GeoCodingService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public getAddress(latitude: number, longitude: number): Observable<Point> {
    const geocoder = ymaps.geocode([latitude, longitude]);
    return new Observable((observer) => {
      geocoder.then(
        (result) => {
          const place = result.geoObjects.get(0);
          if (place) {
            const point = new Point();
            point.id = null;
            point.googlePlaceId = null;
            point.placeId = null;
            point.name = place.properties._data.name || place.properties._data.text;
            point.title = `${place.properties._data.name}${', '}${place.properties._data.description}`;
            point.type = PointServiceType.internet;
            point.provider = ProviderName.yandex;
            point.subtype = YandexPlaceType[place.properties._data.metaDataProperty.GeocoderMetaData.kind];

            const address = this.map.address.getDetailsAddress(place);
            if (address) {
              point.address = new PointAddress();
              point.address.country = address.country;
              point.address.city = address.city;
              point.address.street = address.street;
              point.address.district = address.district;
              point.address.house = address.house;
              point.address.postCode = address.postCode;
              point.address.countryCode = address.countryCode;
              point.address.description = place.properties._data.description;
            }
            point.position = new Position(place.geometry._coordinates[0], place.geometry._coordinates[1]);
            observer.next(point);
          }
        },
        () => {
          observer.next(null);
        },
      );

    });
  }

  public getCoordinates(address: string): Observable<Position> {
    const geocoder = ymaps.geocode(address);
    return new Observable((observer) => {
      geocoder.then(
        (result) => {
          const place = result.geoObjects.get(0);
          if (place) {
            const position = new Position(place.geometry._coordinates[0], place.geometry._coordinates[1]);
            observer.next(position);
          }
        },
        () => {
          observer.next(null);
        },
      );
    });
  }

}

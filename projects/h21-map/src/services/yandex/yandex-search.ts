import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// enums
import { YandexPlaceType } from '../../enums/yandex/yandex-place-type';
import { PointServiceType } from '../../enums/point-service-type.enum';
import { ProviderName } from '../../enums/provider-name.enum';

// interfaces
import { Point } from '../../models/point.model';

// models
import { Position } from '../../models/position.model';
import { PointAddress } from '../../models/point-address.model';

// services
import { SearchService } from '../abstract/abstract-search';

@Injectable()
export class YandexSearchService extends SearchService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public searchAutocomplete(query: string): Observable<Point[]> {
    const result = [];
    const options: ymaps.GeocodeOptions = {
      results: 5,
    };
    const geocoder = ymaps.geocode(query, options);
    return new Observable((observer) => {
      geocoder.then((results) => {
        for (let n = 0; n < results.geoObjects.getLength(); n++) {
          const place = results.geoObjects.get(n);
          const point = new Point();
          point.id = null;
          point.googlePlaceId = null;
          point.placeId = null;
          point.type = PointServiceType.internet;
          point.provider = ProviderName.yandex;
          point.name = place.properties._data.name || place.properties._data.text;
          point.title = `${place.properties._data.name}${', '}${place.properties._data.description}`;
          point.subtype = YandexPlaceType[place.properties._data.metaDataProperty.GeocoderMetaData.kind];
          point.position = new Position(place.geometry._coordinates[0], place.geometry._coordinates[1]);

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

          result.push(point);
        }
        observer.next(result);
      },
        () => {
          observer.next(null);
        },
      );
    });
  }

  public searchDetails(placeId: string): Observable<Point> {
    return new Observable((observer: Observer<Point>) => {
      observer.next(null);

    });
  }

  public searchPlace(query: string): Observable<Point[]> {
    const result = [];
    const options: ymaps.control.ISearchControlParameters = {
      options: { provider: 'yandex#search', },
    };

    const searchControl: ymaps.control.SearchControl = new ymaps.control.SearchControl(options);
    searchControl.search(query);
    return new Observable((observer: Observer<Point[]>) => {
      searchControl.events.add('load', () => {
        const results = searchControl.getResultsArray();
        for (const place of results) {
          const point = new Point();
          point.id = place.properties._data.metaDataProperty.GeocoderMetaData.id;
          point.name = place.properties._data.name || place.properties._data.text;
          point.type = PointServiceType.internet;
          point.provider = ProviderName.yandex;

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
          result.push(point);
        }
        observer.next(result);
      });
      searchControl.events.add('error', () => {
        observer.next(null);
      });
    });
  }

}

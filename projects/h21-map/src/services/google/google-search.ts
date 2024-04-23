import { Injectable } from '@angular/core';

// external libs
import { Observable, Observer } from 'rxjs';

// interfaces
import { IImages } from '../../interfaces/icon.interface';

// enums
import { ProviderName } from '../../enums/provider-name.enum';
import { GooglePlaceType } from '../../enums/google/google-place-type';
import { GoogleErrorMessages } from '../../enums/google/google-messages-error';

// models
import { Point } from '../../models/point.model';
import { PointAddress } from '../../models/point-address.model';
import { Position } from '../../models/position.model';

// services
import { SearchService } from '../abstract/abstract-search';

declare var google: any;
type Components = google.maps.GeocoderAddressComponent[];

@Injectable()
export class GoogleSearchService extends SearchService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public searchAutocomplete(query: string, isCities: boolean): Observable<Point[]> {
    try {
      if (!google || !google.maps) {
        return;
      }
      const result = [];
      const service: google.maps.places.AutocompleteService = new google.maps.places.AutocompleteService();
      const request = {
        input: query,
        types: isCities ? ['(cities)'] : null,
        language: this.map.apiConfig.language,
      };
      return new Observable((observer: Observer<Point[]>) => {
        service.getPlacePredictions(request, (results: google.maps.places.AutocompletePrediction[],
          status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (const place of results) {
              const point = new Point();
              point.id = place.place_id;
              point.placeId = place.place_id;
              point.googlePlaceId = place.place_id;
              point.title = place.description;
              point.name = place.structured_formatting.main_text;
              point.address = new PointAddress();
              point.address.description = place.structured_formatting.secondary_text;
              point.provider = ProviderName.google;
              if (place.types[0]) {
                point.subtype = GooglePlaceType[place.types[0]];
                if (point.subtype === GooglePlaceType.airport) {
                  point.iata = place.description.substring(place.description.indexOf('(') + 1, place.description.indexOf(')'));
                }
              }
              result.push(point);
            }
            observer.next(<Point[]>result);
          } else {
            observer.next(null);
            this.map.mapErrorAPI.next(GoogleErrorMessages[status]);
          }
        });
      });
    } catch {
    }
  }

  public searchDetails(placeId: string): Observable<Point> {
    try {
      if (!google || !google.maps) {
        return;
      }
      return new Observable((observer: Observer<Point>) => {
        const placesService: google.maps.places.PlacesService = new google.maps.places.PlacesService(this.map.api);
        placesService.getDetails({ placeId: placeId, language: this.map.apiConfig.language },
          (result: google.maps.places.PlaceResult, status: google.maps.places.PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              if (result) {
                const place = result;
                const point = new Point();
                point.id = place.place_id;
                point.title = place.formatted_address;
                point.name = place.name || place.formatted_address;
                point.provider = ProviderName.google;
                point.googlePlaceId = place.place_id;
                if (place.types.length > 0) {
                  point.subtype = GooglePlaceType[place.types[0]];
                }
                const address = this.map.address.getDetailsAddress(place);
                if (address) {
                  point.address = new PointAddress();
                  point.address.city = address.city;
                  point.address.country = address.country;
                  point.address.district = address.district;
                  point.address.countryCode = address.countryCode;
                  point.address.description = place.formatted_address;
                  point.address.street = address.street;
                  point.address.house = address.house;
                }
                point.position = new Position(place.geometry.location.lat(), place.geometry.location.lng());
                if (place.photos && place.photos.length > 0) {
                  point.photos = [];
                  const images: IImages = {
                    url: place.photos[0].getUrl({ maxWidth: 450, maxHeight: 450 }),
                    height: 450,
                    width: 450,
                  };
                  point.photos.push(images);
                }
                observer.next(point);
              } else {
                observer.next(null);
              }
            } else {
              this.map.mapErrorAPI.next(GoogleErrorMessages[status]);
            }
          });

      });
    } catch {
    }
  }

}

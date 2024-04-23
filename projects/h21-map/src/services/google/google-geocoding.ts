import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// enums
import { PointServiceType } from '../../enums/point-service-type.enum';
import { ProviderName } from '../../enums/provider-name.enum';
import { GooglePlaceType } from '../../enums/google/google-place-type';

// models
import { GoogleErrorMessages } from '../../enums/google/google-messages-error';
import { PointAddress } from '../../models/point-address.model';
import { Position } from '../../models/position.model';
import { Point } from '../../models/point.model';

// services
import { GeoCodingService } from '../abstract/abstract-geocoding';

type Components = google.maps.GeocoderAddressComponent[];

@Injectable()
export class GoogleGeocodingService extends GeoCodingService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public getCoordinates(address: string): Observable<Position> {
    const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
    return new Observable((observer) => {
      geocoder.geocode({ address: address },
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results) {
              const position = new Position(results[0].geometry.location.lat(), results[0].geometry.location.lng());
              observer.next(position);
            } else {
              observer.next(null);
            }

          } else {
            observer.error(status);
            this.map.mapErrorAPI.next(GoogleErrorMessages[status]);
          }
          observer.complete();
        });
    });
  }

  public getAddress(latitude: number, longitude: number): Observable<Point> {
    const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
    const latLng: google.maps.LatLng = new google.maps.LatLng(latitude, longitude);
    return new Observable((observer) => {
      geocoder.geocode({ location: latLng },
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results) {
              const point = new Point();
              const pl = results[0];
              point.id = pl.place_id;
              point.placeId = pl.place_id;
              point.googlePlaceId = pl.place_id;
              point.name = pl.formatted_address;
              point.type = PointServiceType.internet;
              point.provider = ProviderName.google;
              point.subtype = pl.types[0];

              const address = this.map.address.getDetailsAddress(results[0]);
              if (address) {
                point.address = new PointAddress();
                point.address.city = address.city;
                point.address.country = address.country;
                point.address.district = address.district;
                point.address.countryCode = address.countryCode;
                point.address.description = pl.formatted_address;
              }
              point.position = new Position(pl.geometry.location.lat(), pl.geometry.location.lng());
              if (pl.types[0]) {
                point.subtype = GooglePlaceType[pl.types[0]];
              }
              observer.next(point);

            }
          } else {
            this.map.mapErrorAPI.next(GoogleErrorMessages[status]);
          }
        });
    });
  }

}


import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// models
import { PointAddress } from '../../models/point-address.model';
import { Position } from '../../models/position.model';
import { Point } from '../../models/point.model';

// enums
import { PointServiceType } from '../../enums/point-service-type.enum';
import { ProviderName } from '../../enums/provider-name.enum';

// services
import { GeoCodingService } from '../abstract/abstract-geocoding';

@Injectable()
export class BaiduGeocodingService extends GeoCodingService<BMap.Map, BMap.Marker, BMap.Polyline> {

  public getCoordinates(address: string): Observable<Position> {
    const geocoder = new BMap.Geocoder();
    return new Observable((observer) => {
      geocoder.getPoint(address, (point: BMap.Point) => {
        if (point) {
          const position = new Position(point.lat, point.lng);
          observer.next(position);
        } else {
          observer.next(null);
        }
      }, '');
    });
  }

  public getAddress(latitude: number, longitude: number): Observable<Point> {
    const latLng = new BMap.Point(longitude, latitude);
    const geocoder = new BMap.Geocoder();
    return new Observable((observer) => {
      geocoder.getLocation(latLng, (place: BMap.GeocoderResult) => {
        if (place) {
          const point = new Point();
          point.name = place.address;
          point.id = ' ';
          point.type = PointServiceType.internet;
          point.provider = ProviderName.baidu;
          point.position = new Position(place.point.lat, place.point.lng);

          const address = this.getDetailedAddress(place);
          if (address) {
            point.address = new PointAddress();
            point.address.city = address.city;
            point.address.country = address.country;
            point.address.district = address.district;
            point.address.house = address.house;
            point.address.countryCode = address.countryCode;
            point.address.description = place.address;

          }
          observer.next(point);
        }

        observer.complete();
      });
    });

  }

  public getDetailedAddress(place: BMap.GeocoderResult): any {
    try {
      const components = place.addressComponents;
      if (!components) {
        return null;
      }
      const city = components.city || '';
      const district = components.district || components.province || '';
      const street = components.street || '';
      const house = components.streetNumber || '';
      const country = place.address.split(',').pop() || '';
      const countryCode = country.slice(0, 3).toUpperCase() || '';
      return {country, city, district, street, house, countryCode};
    } catch (error) {
    }
  }

}

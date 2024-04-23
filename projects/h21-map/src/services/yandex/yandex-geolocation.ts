import { Injectable } from '@angular/core';

// services
import { GeolocationService } from '../abstract/abstract-geolocation';

@Injectable()
export class YandexGeoLocationService extends GeolocationService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> { }

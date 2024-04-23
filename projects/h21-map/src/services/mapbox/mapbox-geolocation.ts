import { Injectable } from '@angular/core';

// services
import { GeolocationService } from '../abstract/abstract-geolocation';

@Injectable()
export class MapboxGeoLocationService extends GeolocationService<L.Map, L.Marker, L.Polyline> { }

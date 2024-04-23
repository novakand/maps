import { Injectable } from '@angular/core';

// services
import { GeolocationService } from '../abstract/abstract-geolocation';

@Injectable()
export class GoogleGeoLocationService extends GeolocationService<google.maps.Map, google.maps.Marker, google.maps.Polyline> { }

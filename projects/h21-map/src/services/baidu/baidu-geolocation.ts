import { Injectable } from '@angular/core';

// services
import { GeolocationService } from '../abstract/abstract-geolocation';

@Injectable()
export class BaiduGeoLocationService extends GeolocationService<BMap.Map, BMap.Marker, BMap.Polyline> { }

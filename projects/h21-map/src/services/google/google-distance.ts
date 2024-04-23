import { Injectable } from '@angular/core';

// services
import { DistanceService } from '../abstract/abstract-distance';

@Injectable()
export class GoogleDistanceService extends DistanceService<google.maps.Map, google.maps.Marker, google.maps.Polyline> { }

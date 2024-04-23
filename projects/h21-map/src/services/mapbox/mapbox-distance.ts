import { Injectable } from '@angular/core';

// services
import { DistanceService } from '../abstract/abstract-distance';

@Injectable()
export class MapboxDistanceService extends DistanceService<L.Map, L.Marker, L.Polyline> { }

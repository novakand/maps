import { Injectable } from '@angular/core';

// services
import { DistanceService } from '../abstract/abstract-distance';

@Injectable()
export class BaiduDistanceService extends DistanceService<BMap.Map, BMap.Marker, BMap.Polyline> { }

import { Injectable } from '@angular/core';

// services
import { DistanceService } from '../abstract/abstract-distance';

@Injectable()
export class YandexDistanceService extends DistanceService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> { }

import { Injectable } from '@angular/core';

// external libs
import { Observable } from 'rxjs';

// interfaces
import { IInitMap } from '../../interfaces/init-map.interface';

// models
import { EventLoad } from '../../models/event-load.model';
import { Position } from '../../models/position.model';
import { Bounds } from '../../models/bounds-map.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class EventService<T, U, N> implements IInitMap<T, U, N> {

  public map: MapService<T, U, N>;

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public abstract createEvent<E>(eventName: string): Observable<E>;

  public abstract createEventRightClick(): Observable<any>;

  public abstract createEventBoundsChange(): Observable<Bounds>;

  public abstract createEventZoomChange(): Observable<number>;

  public abstract createEventCenterChange(): Observable<Position>;

  public abstract createEventload(): Observable<EventLoad>;

}

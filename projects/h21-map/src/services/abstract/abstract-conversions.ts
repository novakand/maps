import { Injectable } from '@angular/core';

// interface
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// models
import { ClientPosition } from '../../models/event-client-pixel.model';
import { EventPosition } from '../../models/event-position.model';
import { EventLoad } from '../../models/event-load.model';
import { Bounds } from '../../models/bounds-map.model';
import { Position } from '../../models/position.model';

// services
import { MapService } from './abstract-map';

@Injectable()
export abstract class ConversionsService<T, U, N> {

  public map: MapService<T, U, N>;

  public initMap(map: MapService<T, U, N>): void {
    this.map = map;
  }

  public abstract translatePosition(event: IEventMouse): EventPosition;

  public abstract translateRoutePosition(positions: any[], reverse: boolean): any;

  public abstract translateBounds(event?: IEventMouse): Bounds;

  public abstract translateLatLngClientXY(event: IEventMouse): ClientPosition;

  public abstract translateClientXY(event: IEventMouse): ClientPosition;

  public abstract translateCenter(): Position;

  public abstract translateEventLoad(): EventLoad;

  public translateEventDraw(event: any): void {
    let eventChange;
    switch (event.type || event.originalEvent.type) {
      case 'draw:circle_create':
      case 'draw:circle_centre_change':
      case 'draw:circle_radius_complete':
      case 'draw:circle_radius_change':
      case 'draw:circle_center_complete':
        eventChange = event.eventCircle
          || event.originalEvent.eventCircle;
        break;
      case 'draw:area_create':
        eventChange = event.eventArea
          || event.originalEvent.eventArea;
        break;
      case 'draw:mode':
        eventChange = event.eventMode
          || event.originalEvent.eventMode;
        break;
      case 'draw:marker_mouseover':
      case 'draw:marker_create':
      case 'draw:marker_click':
        eventChange = event.eventMarker
          || event.originalEvent.eventMarker;
        break;
    }
    return eventChange;
  }

}

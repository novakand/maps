import { Injectable } from '@angular/core';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// models
import { Position } from '../../models/position.model';
import { ClientPosition } from '../../models/event-client-pixel.model';
import { Bounds } from '../../models/bounds-map.model';

// services
import { ConversionsService } from '../abstract/abstract-conversions';
import { EventPosition } from '../../models/event-position.model';
import { EventLoad } from '../../models/event-load.model';

@Injectable()
export class MapboxConversionsService extends ConversionsService<L.Map, L.Marker, L.Polyline> {

  public translateRoutePosition(positions: any[], reverse: boolean) {
    const coords = [];
    for (const item of positions) {
      reverse ? coords.push(new Position(item.lat, item.lng)) : coords.push(new L.LatLng(item[1], item[0]));
    }
    return coords;
  }

  public translateBounds(): Bounds {
    const bounds = this.map.api.getBounds();
    if (bounds) {
      const SW = bounds.getSouthWest();
      const NE = bounds.getNorthEast();
      const currentBounds = new Bounds();
      currentBounds.ne = new Position(NE.lat, NE.lng);
      currentBounds.sw = new Position(SW.lat, NE.lng);
      return currentBounds;
    }
  }

  public translateCenter(): Position {
    const center = this.map.api.getCenter();
    if (center) {
      return new Position(center.lat, center.lng);
    }
  }

  public translatePosition(event: IEventMouse): EventPosition {
    const eventPosition = new EventPosition();
    eventPosition.placeId = null;
    if (event.latlng) {
      eventPosition.position = new Position(event.latlng.lat, event.latlng.lng);
    } else {
      const _latLng = this.map.api.mouseEventToLatLng(event);
      eventPosition.position = new Position(_latLng.lat, _latLng.lng);
    }
    return eventPosition;
  }

  public translateLatLngClientXY(event: IEventMouse): ClientPosition {
    const px = this.map.api.latLngToContainerPoint(event.latlng);
    const pixel = new ClientPosition();
    pixel.clientX = event.offsetX ? px.x + event.offsetX : px.x;
    pixel.clientY = px.y;
    return pixel;
  }

  public translateClientXY(event: IEventMouse): ClientPosition {
    const pixel = new ClientPosition();
    pixel.clientX = event.originalEvent.clientX;
    pixel.clientY = event.originalEvent.clientY - 10;
    pixel.position = new Position(event.latlng.lat, event.latlng.lng);
    return pixel;
  }

  public translateEventLoad(): EventLoad {
    const eventLoad = new EventLoad();
    eventLoad.zoom = this.map.getZoom();
    eventLoad.center = this.translateCenter();
    return eventLoad;
  }

}

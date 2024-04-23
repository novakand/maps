import { Injectable } from '@angular/core';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';
import { Bounds } from '../../models/bounds-map.model';
import { ClientPosition } from '../../models/event-client-pixel.model';
import { EventLoad } from '../../models/event-load.model';
import { EventPosition } from '../../models/event-position.model';

// models
import { Position } from '../../models/position.model';

// services
import { ConversionsService } from '../abstract/abstract-conversions';

@Injectable()
export class BaiduConversionsService extends ConversionsService<BMap.Map, BMap.Marker, BMap.Polyline> {

  public translateRoutePosition(positions: any[], reverse: boolean) {
    const coords = [];
    for (const item of positions) {
      reverse ? coords.push(new Position(item.lat, item.lng)) : coords.push(new BMap.Point(item[1], item[0]));
    }
    return coords;
  }

  public translatePosition(event: IEventMouse): EventPosition {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    } else {
      window.event.cancelBubble = true;
    }
    const eventPosition = new EventPosition();
    eventPosition.placeId = null;
    eventPosition.position = new Position(event.point.lat, event.point.lng);
    return eventPosition;
  }

  public translateCenter(): Position {
    const center = this.map.api.getCenter();
    if (center) {
      return new Position(center.lat, center.lng);
    }
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

  public translateLatLngClientXY(event: IEventMouse): ClientPosition {
    const px = this.map.api.pointToPixel(event.currentTarget.point);
    const pixel = new ClientPosition();
    pixel.clientX = px.x;
    pixel.clientY = px.y;
    return pixel;
  }

  public translateClientXY(event: IEventMouse): ClientPosition {
    const pixel = new ClientPosition();
    pixel.clientX = event.pixel.x;
    pixel.clientY = event.pixel.y;
    pixel.position = new Position(event.point.lat, event.point.lng);
    return pixel;

  }

  public translateEventLoad(): EventLoad {
    const eventLoad = new EventLoad();
    eventLoad.zoom = this.map.getZoom();
    eventLoad.center = this.translateCenter();
    return eventLoad;

  }

}

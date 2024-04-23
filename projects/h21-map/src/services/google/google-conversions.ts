import { Injectable } from '@angular/core';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// models
import { Position } from '../../models/position.model';
import { Bounds } from '../../models/bounds-map.model';
import { ClientPosition } from '../../models/event-client-pixel.model';
import { EventLoad } from '../../models/event-load.model';
import { EventPosition } from '../../models/event-position.model';

// services
import { ConversionsService } from '../abstract/abstract-conversions';
import { GeometryBounds } from '../../models/geometry-bonds.model';

@Injectable()
export class GoogleConversionsService extends ConversionsService<google.maps.Map, google.maps.Marker, google.maps.Polyline> {

  public translateRoutePosition(positions: any[], reverse: boolean) {
    const coords = [];
    for (const item of positions) {
      reverse ? coords.push(new Position(item.lat(), item.lng()))
        : coords.push(new google.maps.LatLng(item[0], item[1]));
    }
    return coords;
  }

  public translatePosition(event: IEventMouse): EventPosition {
    let placeId = null;
    if (event.placeId) {
      event.stop();
      placeId = event.placeId;
    }
    const eventPosition = new EventPosition();
    eventPosition.placeId = placeId;
    eventPosition.position = new Position(event.latLng.lat(), event.latLng.lng());
    return eventPosition;
  }

  public translateCenter(): Position {
    const center = this.map.api.getCenter();
    if (center) {
      return new Position(center.lat(), center.lng());
    }
  }

  public translateBounds(): Bounds {
    const bounds = this.map.api.getBounds();
    if (bounds) {
      const SW = bounds.getSouthWest();
      const NE = bounds.getNorthEast();
      const currentBounds = new Bounds();
      currentBounds.ne = new Position(NE.lat(), NE.lng());
      currentBounds.sw = new Position(SW.lat(), SW.lng());
      currentBounds.geometryBounds = new GeometryBounds();
      currentBounds.geometryBounds.bbox = [NE.lat(), NE.lng(), SW.lat(), SW.lng()];
      currentBounds.geometryBounds.zoom = this.map.api.getZoom();
      return currentBounds;
    }
  }

  public translateLatLngClientXY(event: IEventMouse): ClientPosition {
    const overlay = this.map.getOverlay<google.maps.OverlayView>();
    if (overlay) {
      const px = overlay.getProjection().fromLatLngToContainerPixel(event.latLng);
      const pixel = new ClientPosition();
      pixel.clientX = px.x;
      pixel.clientY = px.y;
      return pixel;
    }

  }

  public translateClientXY(event: IEventMouse): ClientPosition {
    const pixel = new ClientPosition();
    pixel.clientX = event.wa.clientX;
    pixel.clientY = event.wa.clientY;
    pixel.position = new Position(event.latLng.lat(), event.latLng.lng());
    return pixel;

  }

  public translateEventLoad(): EventLoad {
    const eventLoad = new EventLoad();
    eventLoad.zoom = this.map.getZoom();
    eventLoad.center = this.translateCenter();
    return eventLoad;
  }

}

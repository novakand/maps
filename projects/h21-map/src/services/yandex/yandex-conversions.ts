import { Injectable } from '@angular/core';

// interfaces
import { IEventMouse } from '../../interfaces/event-mouse-map.interface';

// models
import { Position } from '../../models/position.model';
import { ClientPosition } from '../../models/event-client-pixel.model';
import { Bounds } from '../../models/bounds-map.model';
import { EventLoad } from '../../models/event-load.model';
import { EventPosition } from '../../models/event-position.model';

// services
import { ConversionsService } from '../abstract/abstract-conversions';

@Injectable()
export class YandexConversionsService extends ConversionsService<ymaps.Map, ymaps.GeoObject, ymaps.Polyline> {

  public translateRoutePosition(positions: any[], reverse: boolean) {
    const coords = [];
    for (const item of positions) {
      reverse ? coords.push(new Position(item.lat, item.lng)) : coords.push([item[1], item[0]]);
    }
    return coords;
  }

  public translateLatLng(LatLng: number[]): Position {
    return new Position(LatLng[0], LatLng[1]);
  }

  public translateCenter(): Position {
    const center = this.map.api.getCenter();
    if (center) {
      return new Position(center[0], center[1]);
    }
  }

  public translateBounds(event): any {
    const bounds = event.get('newBounds');
    if (bounds) {
      const currentBounds = new Bounds();
      currentBounds.ne = new Position(bounds[0][0], bounds[0][1]);
      currentBounds.sw = new Position(bounds[1][0], bounds[1][1]);
      return currentBounds;
    }
  }

  public translatePosition(event: IEventMouse): EventPosition {
    event.stopImmediatePropagation();
    if (event) {
      const latLng = event.get('coords');
      const eventPosition = new EventPosition();
      eventPosition.placeId = null;
      eventPosition.position = new Position(latLng[0], latLng[1]);
      return eventPosition;
    }
  }

  public translateLatLngClientXY(event: IEventMouse): ClientPosition {
    let LatLng = event.get('target').geometry;
    LatLng ? LatLng = event.get('target').geometry.getCoordinates() : LatLng = event.geometry;
    const px = this._fromLatLngToPixel(LatLng);
    const offset = this.map.api.container.getOffset();
    const pixel = new ClientPosition();
    pixel.clientX = px[0] - offset[0] + event.offsetX;
    pixel.clientY = px[1] - offset[1] + event.offsetY;
    return pixel;
  }

  public translateClientXY(event: IEventMouse): ClientPosition {
    const latLng = event.get('coords');
    const pixel = new ClientPosition();
    pixel.clientX = event.get('domEvent').get('clientX');
    pixel.clientY = event.get('domEvent').get('clientY');
    pixel.position = new Position(latLng[0], latLng[1]);
    return pixel;
  }

  public translateEventLoad(): EventLoad {
    const eventLoad = new EventLoad();
    eventLoad.zoom = this.map.getZoom();
    eventLoad.center = this.translateCenter();
    return eventLoad;
  }

  private _fromLatLngToPixel(position) {
    const projection: any = this.map.api.options.get('projection', {});
    return this.map.api.converter.globalToPage(
      projection.toGlobalPixels(
        position,
        this.map.api.getZoom(),
      ),
    );
  }

}

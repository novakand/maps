// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { MapboxRouteService } from './mapbox-route';

export class MapboxRouteTransitService {

  public route: MapboxRouteService;

  public initRoute(route: MapboxRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public createSymbol(route: H21MapRouteDirective): string {
    return '5 10';
  }

  public getSegment(route: H21MapRouteDirective) {
    const start = new L.LatLng(route.startLatitude, route.startLongitude);
    const end = new L.LatLng(route.endLatitude, route.endLongitude);
    let latLngs = [];
    latLngs = this.route.geodesic.curvedLine(start, end);
    return latLngs;
  }

}

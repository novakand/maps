// libs
import { Geodesic } from '@h21-map/leaflet-geodesic';

// directiveS
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { MapboxRouteService } from './mapbox-route';

export class MapboxRouteFlyService {

  public route: MapboxRouteService;
  public geodesic: any;
  public geodesicIsInit = false;

  public initRoute(route: MapboxRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public getSegment(route: H21MapRouteDirective) {
    const patch = [];
    patch.push([route.startLatitude, route.startLongitude]);
    patch.push([route.endLatitude, route.endLongitude]);
    return this.route.geodesic.generateGeodesic([[patch[0], patch[1]]]);
  }

}

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { MapboxRouteService } from './mapbox-route';

export class MapboxRouteWalkService {

  public route: MapboxRouteService;

  public initRoute(route: MapboxRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public createSymbol(route: H21MapRouteDirective): any {
    return {};
  }

  public getSegment(route: H21MapRouteDirective) {
    let patch = [];
    patch.push([route.startLongitude, route.startLatitude]);
    patch.push([route.endLongitude, route.endLatitude]);
    patch = this.route.map.conversions.translateRoutePosition(patch, false);
    return patch;
  }

}

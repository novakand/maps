// interfaces
import { IBuildRoute } from '../../interfaces/build-route.interface';

// services
import { GoogleRouteService } from './google-route';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

export class GoogleRouteWalkService implements IBuildRoute {

  public route: GoogleRouteService;

  public initRoute(route: GoogleRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective): google.maps.LatLng[] {
    return this.getSegment(route);
  }

  public createSymbol(route: H21MapRouteDirective): google.maps.Symbol {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      strokeOpacity: route.routeStrokeOpacity,
      fillOpacity: 1,
      strokeColor: route.routeStrokeColor,
      scale: 2,
    };
  }

  public getSegment(route: H21MapRouteDirective) {
    let patch = [];
    patch.push([route.startLongitude, route.startLatitude]);
    patch.push([route.endLongitude, route.endLatitude]);
    patch = this.route.map.conversions.translateRoutePosition(patch, false);
    this.route.getInfo(route, null, patch);
    return patch;
  }

}

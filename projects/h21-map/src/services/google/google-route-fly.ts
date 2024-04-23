// services
import { GoogleRouteService } from './google-route';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// interfaces
import { IBuildRoute } from '../../interfaces/build-route.interface';

export class GoogleRouteFlyService implements IBuildRoute {

  public route: GoogleRouteService;

  public initRoute(route: GoogleRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective): google.maps.LatLng[] {
    return this.getSegment(route);
  }

  public getSegment(route: H21MapRouteDirective) {
    let patch = [];
    patch.push([route.startLatitude, route.startLongitude]);
    patch.push([route.endLatitude, route.endLongitude]);
    patch = this.route.map.conversions.translateRoutePosition(patch, false);
    return patch;
  }

}

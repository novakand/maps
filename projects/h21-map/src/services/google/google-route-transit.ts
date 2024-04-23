// libs
import { Geodesic } from '@h21-map/google-geodesic';

// services
import { GoogleRouteService } from './google-route';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// interfaces
import { IBuildRoute } from '../../interfaces/build-route.interface';

export class GoogleRouteTransitService implements IBuildRoute {

  public route: GoogleRouteService;
  private _geodesic: Geodesic;

  public initRoute(route: GoogleRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public createSymbol(route: H21MapRouteDirective): google.maps.Symbol {
    return {
      path: 'M 0,-1 0,1',
      strokeOpacity: route.routeStrokeOpacity,
      strokeWeight: route.routeStrokeWeight,
      strokeColor: route.routeStrokeColor,
      scale: 3.7,
    };
  }

  public getSegment(route: H21MapRouteDirective): google.maps.LatLng[] {
    const start = new google.maps.LatLng(route.startLatitude, route.startLongitude);
    const end = new google.maps.LatLng(route.endLatitude, route.endLongitude);
    let latLngs = [];
    this._geodesic = new Geodesic();
    latLngs = this._geodesic.curvedLine(start, end);
    this.route.getInfo(route, null, latLngs);
    return latLngs;
  }

}

import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';
import { MapboxRouteService } from './mapbox-route';
import { Observable } from 'rxjs';

export class MapboxRouteCarService {

  public route: MapboxRouteService;

  public initRoute(route: MapboxRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return new Observable((observer) => {
      this.route.createRoute(route).subscribe((results: any) => {
        if (results) {
          observer.next(this.getSegment(results, route));
        }
      });
    });
  }

  public getSegment(result: any, route: H21MapRouteDirective): L.LatLng[] {
    const coords = [];
    for (const item of result.routes[0].legs[0].steps) {
      coords.push(...item.geometry.coordinates);
    }

    const patch = this.route.map.conversions.translateRoutePosition(coords, false);
    if (patch) {
      this.route.getInfo(route, result, patch);
      return patch;
    }
  }

}

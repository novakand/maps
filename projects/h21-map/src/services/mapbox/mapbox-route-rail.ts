// external libs
import { Observable } from 'rxjs';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { MapboxRouteService } from './mapbox-route';

export class MapboxRouteRailsService {

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

  public getSegment(results, route: H21MapRouteDirective) {
    let patch = [];
    patch.push([route.startLongitude, route.startLatitude]);
    patch.push([route.endLongitude, route.endLatitude]);
    patch = this.route.map.conversions.translateRoutePosition(patch, false);
    return patch;
  }

}

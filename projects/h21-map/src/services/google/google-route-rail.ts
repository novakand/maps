// external libs
import { Observable } from 'rxjs';

// services
import { GoogleRouteService } from './google-route';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// interfaces
import { IBuildRoute } from '../../interfaces/build-route.interface';

export class GoogleRouteRailsService implements IBuildRoute {

  public route: GoogleRouteService;

  public initRoute(route: GoogleRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective): Observable<google.maps.LatLng[]> {
    return new Observable((observer) => {
      this.route.createRoute(route).subscribe((results: google.maps.DirectionsResult) => {
        if (results) {
          observer.next(this.getSegment(route, results));
        }
      });
    });
  }

  public getSegment(route: H21MapRouteDirective, result: google.maps.DirectionsResult): google.maps.LatLng[] {
    const patch = [];
    let vehicle;
    const legs = result.routes[0].legs;
    for (const leg of legs) {
      const steps = leg.steps;
      for (const step of steps) {
        const transitMode = step.travel_mode;
        if (transitMode === google.maps.TravelMode.TRANSIT) {
          vehicle = step.transit.line.vehicle.type;
          if (vehicle === 'HEAVY_RAIL' || vehicle === 'HIGH_SPEED_TRAIN' || vehicle === 'COMMUTER_TRAIN') {
            const nextSegment = step.path;
            for (const segment of nextSegment) {
              patch.push(segment);
            }
          }
        }
      }
    }
    this.route.getInfo(route, result, patch);
    return patch;
  }

}

// external lib
import { Observable } from 'rxjs';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { YandexRouteService } from './yandex-route';

// enums
import { RouteParam } from '../../enums/route-param.enum';

export class YandexRouteCarService {

  public route: YandexRouteService;

  public initRoute(route: YandexRouteService): void {
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

  public getSegment(results, route): number[][] {
    const segments = [];
    const responce = [];
    results.getPaths().toArray().forEach((path) => {
      responce.push(path.geometry._coordPath._coordinates[0]);
      responce.push(path.geometry._coordPath._coordinates[path.geometry._coordPath._coordinates.length - 1]);
      path.getSegments().forEach((segment) => {
        segments.push(...segment.getCoordinates());
      });
    });
    results[RouteParam.responsePoints] = responce;
    this.route.getInfo(route, results, segments);
    return segments;

  }

}

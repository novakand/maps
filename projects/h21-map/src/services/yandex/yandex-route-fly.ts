// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { YandexRouteService } from './yandex-route';

export class YandexRouteFlyService {

  public route: YandexRouteService;

  public initRoute(route: YandexRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public getSegment(route: H21MapRouteDirective) {
    let patch = [];
    patch.push([route.startLongitude, route.startLatitude]);
    patch.push([route.endLongitude, route.endLatitude]);
    patch = this.route.map.conversions.translateRoutePosition(patch, false);
    return patch;
  }

}

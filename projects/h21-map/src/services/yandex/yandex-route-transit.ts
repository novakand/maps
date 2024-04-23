// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { YandexRouteService } from './yandex-route';

export class YandexRouteTransitService {

  public route: YandexRouteService;

  public initRoute(route: YandexRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public createSymbol(route: H21MapRouteDirective): string {
    return 'shortdash';
  }

  public getSegment(route: H21MapRouteDirective) {
    const start = [route.startLatitude, route.startLongitude];
    const end = [route.endLatitude, route.endLongitude];
    let latLngs = [];
    latLngs = this.route.geodesic.curvedLine(start, end);
    return latLngs;
  }

}

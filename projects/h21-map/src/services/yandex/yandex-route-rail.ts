// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { YandexRouteService } from './yandex-route';

export class YandexRouteRailsService {

  public route: YandexRouteService;

  public initRoute(route: YandexRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public createSymbol(route: H21MapRouteDirective): google.maps.Symbol {
    return {};
  }

  public getSegment(route: H21MapRouteDirective) { }

}

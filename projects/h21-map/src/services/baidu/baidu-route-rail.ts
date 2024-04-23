// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { BaiduRouteService } from './baidu-route';

export class BaiduRouteRailsService {

  public route: BaiduRouteService;

  public initRoute(route: BaiduRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
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

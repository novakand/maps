// libs
import { Geodesic } from '@h21-map/baidu-geodesic';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { BaiduRouteService } from './baidu-route';

export class BaiduRouteFlyService {

  public route: BaiduRouteService;
  public geodesic: any;
  public geodesicIsInit = false;

  public initRoute(route: BaiduRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public createSymbol(route: H21MapRouteDirective): any {
  }

  public getSegment(route: H21MapRouteDirective) {
    let patch = [];
    patch.push([route.startLatitude, route.startLongitude]);
    patch.push([route.endLatitude, route.endLongitude]);
    patch = this.route.map.conversions.translateRoutePosition(patch, false);
    patch = this.route.geodesic.generateGeodesic([[patch[0], patch[1]]]);
    return patch;

  }

}

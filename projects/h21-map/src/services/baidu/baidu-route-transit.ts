// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { BaiduRouteService } from './baidu-route';

export class BaiduRouteTransitService {

  public route: BaiduRouteService;

  public initRoute(route: BaiduRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective) {
    return this.getSegment(route);
  }

  public createSymbol(route: H21MapRouteDirective): any {
    return 'dashed';
  }

  public getSegment(route: H21MapRouteDirective) {
    const start = new BMap.Point(route.startLongitude, route.startLatitude);
    const end = new BMap.Point(route.endLongitude, route.endLatitude);
    let latLngs = [];
    latLngs = this.route.geodesic.curvedLine(start, end);
    return latLngs;
  }

}

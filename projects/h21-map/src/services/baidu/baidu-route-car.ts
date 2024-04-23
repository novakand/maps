// external libs
import { Observable } from 'rxjs';

// directives
import { H21MapRouteDirective } from '../../directives/h21-map-route.directive';

// services
import { BaiduRouteService } from './baidu-route';

export class BaiduRouteCarService {

  public route: BaiduRouteService;

  public initRoute(route: BaiduRouteService): void {
    this.route = route;
  }

  public getPath(route: H21MapRouteDirective): Observable<BMap.Point[]> {
    return new Observable((observer) => {
      this.route.createRoute(route).subscribe((results: BMap.DrivingRouteResult) => {
        if (results) {
          observer.next(this.getSegment(results, route));
        }
      });
    });
  }

  public getSegment(result: BMap.DrivingRouteResult, routes): any {
    this.route.getInfo(routes, result, result.getPlan(0).getRoute(0).getPath());
    return result.getPlan(0).getRoute(0).getPath();
  }

}

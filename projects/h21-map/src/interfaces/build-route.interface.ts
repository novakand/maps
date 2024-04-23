import { H21MapRouteDirective } from '../directives/h21-map-route.directive';
import { GoogleRouteService } from '../services/google/google-route';

export interface IBuildRoute {
  route: GoogleRouteService;

  getPath(route: H21MapRouteDirective);

  getSegment(route: H21MapRouteDirective, result?: any): any;

  createSymbol?(route: H21MapRouteDirective);
}

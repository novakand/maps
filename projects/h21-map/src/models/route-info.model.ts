import { RouteMode } from '../enums/route-type.enum';
import { RoutePosition } from './route-position.models';
import { RouteValues } from './route-values.model';
import { WayPointsRoute } from './route-waypoints.model';

export class RouteInfo {

  public routePosition: RoutePosition;
  public originPosition: RoutePosition;
  public distance: RouteValues;
  public duration: RouteValues;
  public routeMode: RouteMode;
  public waypoints: WayPointsRoute[];
  public staticUrl: string;

}

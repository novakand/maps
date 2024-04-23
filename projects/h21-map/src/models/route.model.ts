import { TypePoint } from '../enums/point-type.enum';
import { RouteMode } from '../enums/route-type.enum';

export class Route {

  public startLatitude: number;
  public startLongitude: number;
  public startTypePoint?: TypePoint;
  public endLatitude: number;
  public endLongitude: number;
  public endTypePoint?: TypePoint;
  public fitBounds?: boolean;
  public routeMode: RouteMode;
  public strokeColor?: string;
  public strokeOpacity?: number;
  public strokeWeight?: number;

}

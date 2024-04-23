import { TypePoint } from '../enums/point-type.enum';
import { RouteMode } from 'projects/h21-map/src/enums/route-type.enum';

export interface IRoute {

   startLatitude: number;
   startLongitude: number;
   startTypePoint?: TypePoint;
   endLatitude: number;
   endLongitude: number;
   endTypePoint?: TypePoint;
   fitBounds?: boolean;
   routeMode: RouteMode;
   strokeColor?: string;
   strokeOpacity?: number;
   strokeWeight?: number;

}

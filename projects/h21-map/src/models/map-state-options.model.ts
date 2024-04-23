// interfaces
import { IRoute } from '../interfaces/route.interface';

// models
import { CircleEvent } from './circle-event.model';
import { MarkerEvent } from './marker-event.model';
import { AreaEvent } from './area-event.model';
import { Bounds } from './bounds-map.model';
import { Position } from './position.model';

export class MapStateOptions {

  public zoom: number;
  public center: Position;
  public bounds: Bounds;
  public drawMarker: MarkerEvent;
  public drawCircle: CircleEvent;
  public drawArea: AreaEvent;
  public drawMode: any;
  public routes: IRoute;


  constructor(obj: Partial<MapStateOptions>) {
    Object.assign(this, obj);
  }

}

import { Position } from './position.model';

export class MapOptions {

  public center: Position;
  public zoom: number;
  public minZoom: number;
  public maxZoom: number;
  public enableMapClick: boolean;
  public enableAutoResize: boolean;
  public enableDoubleClickZoom: boolean;
  public enableZoomBox: boolean;
  public scaleControl: boolean;
  public enableDraggable: boolean;
  public enableDefaultControl: boolean;
  public defaultCursor: string;
  public enableScrollwheel: boolean;

  constructor(obj: Partial<MapOptions>) {
    Object.assign(this, obj);
  }

}


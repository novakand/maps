// models
import { ClientPosition } from './event-client-pixel.model';
import { Position } from './position.model';

export class CircleEvent {

  public radius: number;
  public position?: Position;
  public pixel?: ClientPosition;
  public isDraw?: boolean;
  public bounds?: any;

  constructor(obj: Partial<CircleEvent>) {
    Object.assign(this, obj);
  }

}

import { Position } from './position.model';

export class EventLoad {

  public center: Position;
  public zoom: number;

  constructor(obj?: Partial<EventLoad>) {
    Object.assign(this, obj);
  }

}

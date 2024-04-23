import { Position } from './position.model';

export class MarkerEvent {

  public position?: Position;
  public isDraw?: boolean;
  public placeId?: string;

  constructor(obj: Partial<MarkerEvent>) {
    Object.assign(this, obj);
  }

}

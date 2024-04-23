import { Position } from '.././models/position.model';

export class DistancePositions {

  public startPosition: Position;
  public endPosition: Position;

  constructor(obj: Partial<DistancePositions>) {
    Object.assign(this, obj);
  }

}

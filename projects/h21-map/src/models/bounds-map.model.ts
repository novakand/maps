import { Position } from './position.model';
import { GeometryBounds } from './geometry-bonds.model';

export class Bounds {

  public ne: Position;
  public sw: Position;
  public geometryBounds?: GeometryBounds;

  constructor(obj?: Partial<Bounds>) {
    Object.assign(this, obj);
  }

}

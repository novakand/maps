import { Position } from './position.model';

export class Area {

  public positions: Position[];
  public fitBounds?: boolean;

  constructor(obj: Partial<Area>) {
    Object.assign(this, obj);
  }

}

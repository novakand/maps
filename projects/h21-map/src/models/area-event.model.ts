import { Position } from './position.model';

export class AreaEvent {

  public id?: number;
  public position: Position[];
  public positions?: Position[][];
  public center?: Position;
  public isDraw?: boolean;
  public bounds?: any;

  constructor(obj: Partial<AreaEvent>) {
    Object.assign(this, obj);
  }

}

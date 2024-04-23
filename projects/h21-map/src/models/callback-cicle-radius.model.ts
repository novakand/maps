import { Position } from './position.model';

export class CallbackCicleInfo {

  public position: Position;
  public radius: number;
  public enabled: boolean;

  constructor(obj: Partial<CallbackCicleInfo>) {
    Object.assign(this, obj);
  }

}

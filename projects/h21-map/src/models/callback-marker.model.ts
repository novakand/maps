import { Position } from './position.model';

export class CallbackMarkerInfo {

  public position: Position;
  public id: string | number;

  constructor(obj: Partial<CallbackMarkerInfo>) {
    Object.assign(this, obj);
  }

}
